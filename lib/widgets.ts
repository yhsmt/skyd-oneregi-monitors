import {GraphWidget} from 'aws-cdk-lib/aws-cloudwatch';

import * as apigw from 'widgets/api-gateway';
import * as dynamodb from 'widgets/dynamodb';
import * as etc from 'widgets/etc';
import * as lambda from 'widgets/lambda';
import * as rds from 'widgets/rds';
import * as r53 from 'widgets/route53';

import { Metrics } from 'metrics';

// INFO: dashboardのwidgetの順番
export const widgets = (m: Metrics): GraphWidget[][] => {
    return [
        [
            r53.route53CfHealthChecks(m.cfHealthCheckMetrics),
            r53.route53ApiGwHealthChecks(m.apiHealthChecksMetrics),
            apigw.apiGatewayRequests(m.apiCountMetrics),
            apigw.apiGatewayLatency(m.apiLatencyMetrics),
        ],[
            apigw.apiGateway5XXError(m.api5XXErrorMetrics),
            rds.rdsProxyConnections(m.rdsProxyConnMetrics),
            rds.rdsConnections(m.rdsConnectionMetrics),
            rds.rdsDmlLatency(m.rdsDmlLatencyMetrics),
        ],[
            rds.rdsCpuUtilization(m.rdsCpuUsageMetrics),
            rds.rdsFreeableMemory(m.rdsFreeMemMetrics),
            rds.rdsSlowQueryLogCount(m.rdsSlowQueryLogCount),
            etc.sqsNumOfVisibleMessages(m.sqsNumOfVisibleMessages),
        ],[
            dynamodb.dynamodbReadCapacity(m.dynamoDbReadCapacity),
            dynamodb.dynamodbWriteCapacity(m.dynamoDbWriteCapacity),
            lambda.lambdaConcurrentExecs(m.lambdaConcurrentExecs),
            lambda.lambdaErrorLogsCount(m.logsLambdaErrorLogCount),
        ],[
            etc.wafBlockedRequests(m.wafBlockedRequests),
        ]
    ]
}
