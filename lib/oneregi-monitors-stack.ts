import {Aws, CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import {Dashboard} from 'aws-cdk-lib/aws-cloudwatch';
import {Function} from "aws-cdk-lib/aws-lambda";
import {Construct} from 'constructs';

import * as params from 'params';
import {name} from 'utils';
import * as widgets from 'widgets'


export class OneregiMonitorsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create CloudWatch Dashboard
    const dashboard = new Dashboard(this, "SampleLambdaDashboard", {
      dashboardName: name('sample-dashboard'),
      widgets: [
        [
            widgets.route53CfHealthChecks(),
            widgets.route53ApiGwHealthChecks(),
            widgets.apiGatewayRequests(),
            widgets.apiGatewayLatency(),
        ],[
            widgets.apiGateway5XXError(),
            widgets.rdsProxyConnections(),
            widgets.rdsConnections(),
            widgets.rdsDmlLatency(),
        ],[
            widgets.rdsCpuUtilization(),
            widgets.rdsFreeableMemory(),
            widgets.rdsSlowQueryLogCount(),
            widgets.sqsNumOfVisibleMessages(),
        ],[
            widgets.dynamodbReadCapacity(),
            widgets.dynamodbWriteCapacity(),
            widgets.lambdaConcurrentExecs(),
            widgets.lambdaErrorLogsCount(),
        ],[
            widgets.wafBlockedRequests(),
        ]
      ],
    });

    // Generate Outputs
    const cloudwatchDashboardURL = `https://${Aws.REGION}.console.aws.amazon.com/cloudwatch/home?region=${Aws.REGION}#dashboards:name=${dashboard.dashboardName}`;
    new CfnOutput(this, 'DashboardOutput', {
      value: cloudwatchDashboardURL,
      description: 'URL of CloudWatch Dashboard',
      exportName: 'CloudWatchDashboardURL'
    });
  }
}
