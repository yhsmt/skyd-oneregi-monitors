import {Aws, CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import {Dashboard} from 'aws-cdk-lib/aws-cloudwatch';
import {Function} from "aws-cdk-lib/aws-lambda";
import {Construct} from 'constructs';

import * as params from './params';
import {name} from './utils';
import * as widgets from './widgets'


export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = Function.fromFunctionArn(
        this,
        name('sample-function'),
        params.Lambda.functionArn,
    );

    // Create CloudWatch Dashboard
    const dashboard = new Dashboard(this, "SampleLambdaDashboard", {
      dashboardName: name('sample-dashboard')
    });

    widgets.route53CFnHealthChecks(dashboard);
    widgets.lambdaConcurrentExecs(dashboard);

    // Generate Outputs
    const cloudwatchDashboardURL = `https://${Aws.REGION}.console.aws.amazon.com/cloudwatch/home?region=${Aws.REGION}#dashboards:name=${dashboard.dashboardName}`;
    new CfnOutput(this, 'DashboardOutput', {
      value: cloudwatchDashboardURL,
      description: 'URL of CloudWatch Dashboard',
      exportName: 'CloudWatchDashboardURL'
    });
  }
}
