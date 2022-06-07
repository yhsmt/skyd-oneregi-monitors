import {
  Aws, CfnOutput, Stack, StackProps
} from 'aws-cdk-lib';
import {Dashboard, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';
import {Construct} from 'constructs';

import {name} from 'utils';
import {widgets} from 'widgets'
import {
  getCfHealthCheckMetrics, 
  getApiHealthCheckMetrics
} from 'metrics/route53'
import {importRdsClusters} from 'helpers/rds'
import {getLambdaLogsMetricsFilters, typeMetricFilter} from 'helpers/logs'
import  * as apigw from 'metrics/api-gateway'
import  * as rds from 'metrics/rds'


export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // import RDS Clusters
    const rdsClusters: IDatabaseCluster[] = importRdsClusters(this);

    // Metrics
    const cfHealthCheckMetrics:   Metric[] = getCfHealthCheckMetrics(this);
    const apiHealthChecksMetrics: Metric[] = getApiHealthCheckMetrics(this);

    const apiCountMetrics:    Metric[] = apigw.countMetrics();
    const apiLatencyMetrics:  Metric[] = apigw.latencyMetrics();
    const api5XXErrorMetrics: Metric[] = apigw.error5XXMetrics();

    const rdsProxyConnMetrics:  Metric[] = rds.proxyConnectionMetrics();
    const rdsConnectionMetrics: Metric[] = rds.connectionMetrics();
    const rdsDmlLatencyMetrics: Metric[] = rds.dmlLatencyMetrics();
    const rdsCpuUsageMetrics:   Metric[] = rds.cpuUsageMetrics(rdsClusters);
    const rdsFreeMemMetrics:    Metric[] = rds.freeMemMetrics(rdsClusters);
    const rdsSlowQueryLogCount: Metric[] = rds.slowQueryLogMetrics(rdsClusters);

    // MetricFilters
    const lambdaLogsMetricsFilters: typeMetricFilter[] = getLambdaLogsMetricsFilters(this);

    // CloudWatch Dashboard
    const dashboard = new Dashboard(this, 'SampleLambdaDashboard', {
      dashboardName: name('sample-dashboard'),
      widgets: widgets(
          cfHealthCheckMetrics,
          apiHealthChecksMetrics,

          apiCountMetrics,
          apiLatencyMetrics,
          api5XXErrorMetrics,

          rdsProxyConnMetrics,
          rdsConnectionMetrics,
          rdsDmlLatencyMetrics,
          rdsCpuUsageMetrics, 
          rdsFreeMemMetrics,  
          rdsSlowQueryLogCount,

          lambdaLogsMetricsFilters,
      ),
    });

    const cloudwatchDashboardURL = `https://${Aws.REGION}.console.aws.amazon.com/cloudwatch/home?region=${Aws.REGION}#dashboards:name=${dashboard.dashboardName}`;
    new CfnOutput(this, 'DashboardOutput', {
      value: cloudwatchDashboardURL,
      description: 'URL of CloudWatch Dashboard',
      exportName: 'CloudWatchDashboardURL'
    });
  }
}
