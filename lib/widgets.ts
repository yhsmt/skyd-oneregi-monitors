import {IRestApi} from 'aws-cdk-lib/aws-apigateway';
import {GraphWidget} from "aws-cdk-lib/aws-cloudwatch";

import * as apigw from 'widgets/api-gateway';
import * as dynamodb from 'widgets/dynamodb';
import * as etc from 'widgets/etc';
import * as lambda from 'widgets/lambda';
import * as rds from 'widgets/rds';
import * as r53 from 'widgets/route53';

import {HealthCheck} from 'metrics/route53';
import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';

// INFO: dashboardのwidgetの順番
export const widgets = (
    cfdHc: HealthCheck[],
    apiHc: HealthCheck[],
    rdsCs: IDatabaseCluster[],
    ): GraphWidget[][] => {
    return [
        [
            r53.route53CfHealthChecks(cfdHc),
            r53.route53ApiGwHealthChecks(apiHc),
            apigw.apiGatewayRequests(),
            apigw.apiGatewayLatency(),
        ],[
            apigw.apiGateway5XXError(),
            rds.rdsProxyConnections(),
            rds.rdsConnections(),
            rds.rdsDmlLatency(),
        ],[
            rds.rdsCpuUtilization(rdsCs),
            rds.rdsFreeableMemory(rdsCs),
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
