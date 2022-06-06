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
import {Construct} from 'constructs';

import * as params from 'params';
import {name} from 'utils';
import {widgets} from 'widgets'
import {healthCheck} from 'metrics/route53'
import {importRestApis} from 'helpers/api-gateway'


export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // import resources
    const restApis: IRestApi[] = importRestApis(this)

    // Route53 Health Checks
    const healthChecks: CfnHealthCheck[] = restApis.map(
        restApi => healthCheck(
            this,
            'rest-api-' + restApi.restApiId,
            restApi.restApiId + '.execute-api.' + Aws.REGION + '.amazonaws.com',
            '/' + (restApi.deploymentStage ?? 'prod') + '/ping'
        )
    )

    // CloudWatch Dashboard
    const dashboard = new Dashboard(this, "SampleLambdaDashboard", {
      dashboardName: name('sample-dashboard'),
      widgets: widgets(restApis),
    });

    const cloudwatchDashboardURL = `https://${Aws.REGION}.console.aws.amazon.com/cloudwatch/home?region=${Aws.REGION}#dashboards:name=${dashboard.dashboardName}`;
    new CfnOutput(this, 'DashboardOutput', {
      value: cloudwatchDashboardURL,
      description: 'URL of CloudWatch Dashboard',
      exportName: 'CloudWatchDashboardURL'
    });
  }
}
