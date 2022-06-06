import {
  Aws,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {Dashboard} from 'aws-cdk-lib/aws-cloudwatch';
import {Function} from "aws-cdk-lib/aws-lambda";
import {IRestApi} from 'aws-cdk-lib/aws-apigateway';
import {CfnHealthCheck} from 'aws-cdk-lib/aws-route53';
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
import {importLambdaLogGroups} from 'helpers/logs'


export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // import resources
    const restApis: ImportedApi[] = importRestApis(this);
    const rdsClusters: IDatabaseCluster[] = importRdsClusters(this);
    const lambdaLogGroups: ILogGroup[] = importLambdaLogGroups(this);

    // MetricFilters
    const metricFilters: MetricFilter[] = lambdaLogGroups.map(
        logGroup => createMetricFilter(
            this,
            logGroup,
            logGroup.logGroupName + '/errors',
            'ERROR',
        )
    )

    // Route53 Health Checks
    const apiHealthChecks: HealthCheck[] = restApis.map(
        restApi => {
          return {
            healthCheck: createHealthCheck(
                this,
                'rest-api-' + restApi.api.restApiId,
                restApi.api.restApiId + '.execute-api.' + Aws.REGION + '.amazonaws.com',
                '/' + (restApi.api.deploymentStage ?? 'prod') + '/ping'
            ),
            name: restApi.name,
          }
        }
    );
    const cfHealthChecks: HealthCheck[] = params.CloudFront.distURLs.map(
        cfdURL => {
          return {
            healthCheck: createHealthCheck(
                this, 'cf-' + cfdURL, cfdURL, '/'
            ),
            name: cfdURL,
          }
        }
    );

    // CloudWatch Dashboard
    const dashboard = new Dashboard(this, "SampleLambdaDashboard", {
      dashboardName: name('sample-dashboard'),
      widgets: widgets(
          cfHealthChecks,
          apiHealthChecks,
          rdsClusters,
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
