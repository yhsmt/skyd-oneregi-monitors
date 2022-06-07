import {
  Aws, CfnOutput, Stack, StackProps
} from 'aws-cdk-lib';
import {Dashboard} from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';
import {Construct} from 'constructs';

import {name} from 'utils';
import {widgets} from 'widgets';
import {importRdsClusters} from 'helpers/rds';
import {
  getLambdaLogsMetricsFilters, 
  MetricFilterWithNames
} from 'helpers/logs';
import * as r53h from 'helpers/route53'
import * as r53 from 'metrics/route53';
import * as apigw from 'metrics/api-gateway';
import * as rds from 'metrics/rds';
import * as logs from 'metrics/logs';
import { Metrics } from 'metrics';

export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Route53 HealthChecks
    const cfHealthChecks: r53h.HealthCheckWithName[] = r53h.getCfHealthChecks(this);
    const apiHealthChecks: r53h.HealthCheckWithName[] = r53h.getApiHealthChecks(this);

    // import RDS Clusters
    const rdsClusters: IDatabaseCluster[] = importRdsClusters(this);

    // MetricFilters
    const lambdaLogsMetricsFilters: MetricFilterWithNames[] = getLambdaLogsMetricsFilters(this);

    // Metrics
    const metrics: Metrics = {
      cfHealthCheckMetrics:   r53.getHealthCheckMetrics(cfHealthChecks),
      apiHealthChecksMetrics: r53.getHealthCheckMetrics(apiHealthChecks),
      
      apiCountMetrics:    apigw.countMetrics(),
      apiLatencyMetrics:  apigw.latencyMetrics(),
      api5XXErrorMetrics: apigw.error5XXMetrics(),

      rdsProxyConnMetrics:  rds.proxyConnectionMetrics(),
      rdsConnectionMetrics: rds.connectionMetrics(),
      rdsDmlLatencyMetrics: rds.dmlLatencyMetrics(),
      rdsCpuUsageMetrics:   rds.cpuUsageMetrics(rdsClusters),
      rdsFreeMemMetrics:    rds.freeMemMetrics(rdsClusters),
      rdsSlowQueryLogCount: rds.slowQueryLogMetrics(rdsClusters),

      logsLambdaErrorLogCount: logs.lambdaErrorLogCount(lambdaLogsMetricsFilters),
    }

    // CloudWatch Dashboard
    const dashboard = new Dashboard(this, 'SampleLambdaDashboard', {
      dashboardName: name('oneregi-dashboard'),
      widgets: widgets(metrics),
    });

    const cloudwatchDashboardURL = `https://${Aws.REGION}.console.aws.amazon.com/cloudwatch/home?region=${Aws.REGION}#dashboards:name=${dashboard.dashboardName}`;
    new CfnOutput(this, 'DashboardOutput', {
      value: cloudwatchDashboardURL,
      description: 'URL of CloudWatch Dashboard',
      exportName: 'CloudWatchDashboardURL'
    });
  }
}
