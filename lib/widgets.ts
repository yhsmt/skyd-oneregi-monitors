import {GraphWidget, Metric} from 'aws-cdk-lib/aws-cloudwatch';

import * as apigw from 'widgets/api-gateway';
import * as dynamodb from 'widgets/dynamodb';
import * as etc from 'widgets/etc';
import * as lambda from 'widgets/lambda';
import * as rds from 'widgets/rds';
import * as r53 from 'widgets/route53';

import {IDatabaseCluster} from 'aws-cdk-lib/aws-rds';
import { typeMetricFilter } from 'helpers/logs';

// INFO: dashboardのwidgetの順番
export const widgets = (
    cfdHc: Metric[],
    apiHc: Metric[],

    apigwCt: Metric[],
    apigwLtc: Metric[],
    apigw5xx: Metric[],

    rdsPrxy: Metric[],
    rdsConn: Metric[],
    rdsDLtcy: Metric[],
    rdsCpu: Metric[],
    rdsMem: Metric[],
    rdsSlqc: Metric[],

    errLFs: typeMetricFilter[],
    ): GraphWidget[][] => {
    return [
        [
            r53.route53CfHealthChecks(cfdHc),
            r53.route53ApiGwHealthChecks(apiHc),
            apigw.apiGatewayRequests(apigwCt),
            apigw.apiGatewayLatency(apigwLtc),
        ],[
            apigw.apiGateway5XXError(apigw5xx),
            rds.rdsProxyConnections(rdsPrxy),
            rds.rdsConnections(rdsConn),
            rds.rdsDmlLatency(rdsDLtcy),
        ],[
            rds.rdsCpuUtilization(rdsCpu),
            rds.rdsFreeableMemory(rdsMem),
            rds.rdsSlowQueryLogCount(rdsSlqc),
            etc.sqsNumOfVisibleMessages(),
        ],[
            dynamodb.dynamodbReadCapacity(),
            dynamodb.dynamodbWriteCapacity(),
            lambda.lambdaConcurrentExecs(),
            lambda.lambdaErrorLogsCount(errLFs),
        ],[
            etc.wafBlockedRequests(),
        ]
    ]
}
