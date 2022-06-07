import {
  Aws,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {Dashboard} from 'aws-cdk-lib/aws-cloudwatch';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';
import {ILogGroup, MetricFilter} from 'aws-cdk-lib/aws-logs';
import {Construct} from 'constructs';

import * as params from 'params';
import {name} from 'utils';
import {widgets} from 'widgets'
import {createMetricFilter} from 'metrics/logs'
import {createHealthCheck, HealthCheck} from 'metrics/route53'
import {ImportedApi, importRestApis} from 'helpers/api-gateway'
import {importRdsClusters} from 'helpers/rds'
import {importLambdaLogGroups, typeMetricFilter} from 'helpers/logs'


export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Route53 Health Checks
    const cfHealthChecks: HealthCheck[] = this.getCfHealthChecks();
    const apiHealthChecks: HealthCheck[] = this.getApiHealthChecks();

    // import RDS Clusters
    const rdsClusters: IDatabaseCluster[] = importRdsClusters(this);

    // MetricFilters
    const lambdaLogsMetricsFilters: typeMetricFilter[] = this.getLambdaLogsMetricsFilters();

    // CloudWatch Dashboard
    const dashboard = new Dashboard(this, "SampleLambdaDashboard", {
      dashboardName: name('sample-dashboard'),
      widgets: widgets(
          cfHealthChecks,
          apiHealthChecks,
          rdsClusters,
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

  getLambdaLogsMetricsFilters(): typeMetricFilter[] {
    const lambdaLogGroups: ILogGroup[] = importLambdaLogGroups(this);

    return lambdaLogGroups.map(
        logGroup => {
          const metricNamespace = name('oneregi-logs-metric-filters');
          const metricName = logGroup.logGroupName + '/errors';
          return {
            metricFilter: createMetricFilter(
                this,
                logGroup,
                metricNamespace,
                metricName,
                'ERROR',
              ),
            metricNamespace: metricNamespace,
            metricName: metricName,
            label: logGroup.logGroupName.split('/').slice(-1)[0],
          };
        }
    );
  }

  getApiHealthChecks(): HealthCheck[] {
    const restApis: ImportedApi[] = importRestApis(this);
    return restApis.map(
        restApi => {
          return {
            healthCheck: createHealthCheck(
                this,
                'rest-api-' + restApi.api.restApiId,
                restApi.api.restApiId + '.execute-api.' + Aws.REGION + '.amazonaws.com',
                '/' + (restApi.api.deploymentStage ?? 'prod') + '/ping'
            ),
            name: restApi.name,
          };
        }
    );
  }

  getCfHealthChecks(): HealthCheck[] {
    return params.CloudFront.distURLs.map(
        cfdURL => {
          return {
            healthCheck: createHealthCheck(
                this, 'cf-' + cfdURL, cfdURL, '/'
            ),
            name: cfdURL,
          }
        }
    );
  }
}
