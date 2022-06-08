import { Construct } from 'constructs';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

import { Metrics } from 'metrics';
import * as apigw from 'alerm-props/api-gateway';
import * as lambda from 'alerm-props/lambda';
import * as rds from 'alerm-props/rds';

import { name } from 'utils';

export const setAlerms = (c: Construct, metrics: Metrics) => {
    const setAlerm = (f: Function) => {
        return (m: Metric) => m.createAlarm(c, name(`${m.label}-${m.metricName}-alerm`), f(m))
    };

    metrics.apiLatencyMetrics.map(setAlerm(apigw.apiLatency));
    metrics.api5XXErrorMetrics.map(setAlerm(apigw.error5XX));

    metrics.lambdaConcurrentExecs.map(setAlerm(lambda.concurrentExecs));
    metrics.logsLambdaErrorLogCount.map(setAlerm(lambda.errorLogCounts));

    metrics.rdsConnectionMetrics.map(setAlerm(rds.dbConnections));
    metrics.rdsSlowQueryLogCount.map(setAlerm(rds.slowQueryLogCounts))
};