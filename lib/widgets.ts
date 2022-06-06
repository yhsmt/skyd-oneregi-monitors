import {IRestApi} from 'aws-cdk-lib/aws-apigateway';
import {GraphWidget} from "aws-cdk-lib/aws-cloudwatch";

import * as apigw from 'widgets/api-gateway';
import * as dynamodb from 'widgets/dynamodb';
import * as etc from 'widgets/etc';
import * as lambda from 'widgets/lambda';
import * as rds from 'widgets/rds';
import * as r53 from 'widgets/route53';

// INFO: dashboardのwidgetの順番
export const widgets = (apis: IRestApi[]): GraphWidget[][] => {
    return [
        [
            r53.route53CfHealthChecks(),
            r53.route53ApiGwHealthChecks(),
            apigw.apiGatewayRequests(apis),
            apigw.apiGatewayLatency(apis),
        ],[
            apigw.apiGateway5XXError(apis),
            rds.rdsProxyConnections(),
            rds.rdsConnections(),
            rds.rdsDmlLatency(),
        ],[
            rds.rdsCpuUtilization(),
            rds.rdsFreeableMemory(),
            rds.rdsSlowQueryLogCount(),
            etc.sqsNumOfVisibleMessages(),
        ],[
            dynamodb.dynamodbReadCapacity(),
            dynamodb.dynamodbWriteCapacity(),
            lambda.lambdaConcurrentExecs(),
            lambda.lambdaErrorLogsCount(),
        ],[
            etc.wafBlockedRequests(),
        ]
    ]
}
