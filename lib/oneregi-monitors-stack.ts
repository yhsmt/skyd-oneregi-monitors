import {
  Aws, CfnOutput, Stack, StackProps
} from 'aws-cdk-lib';
import {Dashboard} from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';
import {Construct} from 'constructs';

import * as logsh from 'helpers/logs';
import * as r53h from 'helpers/route53'
import * as rdsh from 'helpers/rds'

import { getMetrics, Metrics } from 'metrics';
import { setAlerms } from 'alerms';
import {widgets} from 'widgets';
import {name} from 'utils';

export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Route53 HealthChecks
    const cfHealthChecks: r53h.HealthCheckWithName[] = r53h.getCfHealthChecks(this);
    const apiHealthChecks: r53h.HealthCheckWithName[] = r53h.getApiHealthChecks(this);

    // import RDS Clusters
    const rdsClusters: IDatabaseCluster[] = rdsh.importRdsClusters(this);

    // MetricFilters
    const lambdaLogsMetricsFilters: logsh.MetricFilterWithNames[] = logsh.getLambdaLogsMetricsFilters(this);

    // Metrics
    const metrics: Metrics = getMetrics(
      cfHealthChecks, apiHealthChecks, rdsClusters, lambdaLogsMetricsFilters
    );

    // Alerms
    setAlerms(this, metrics);

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
