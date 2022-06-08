import { Construct } from 'constructs';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Topic } from 'aws-cdk-lib/aws-sns';

import { Metrics } from 'metrics';
import * as apigw from 'alerm-props/api-gateway';
import * as lambda from 'alerm-props/lambda';
import * as rds from 'alerm-props/rds';
import * as r53 from 'alerm-props/route53';
import * as etc from 'alerm-props/etc';

import { name } from 'utils';

export const setAlerms = (c: Construct, metrics: Metrics, topic: Topic) => {
    const setAlerm = (f: Function) => {
        return (m: Metric) => {
            const alarm: Alarm = m.createAlarm(c, name(`${m.label}-${m.metricName}-alerm`), f(m));
            alarm.addAlarmAction(new SnsAction(topic));
        }
    };

    metrics.cfHealthCheckMetrics.map(setAlerm(r53.healthCheck))

    metrics.apiHealthChecksMetrics.map(setAlerm(apigw.healthCheck));
    metrics.apiLatencyMetrics.map(setAlerm(apigw.apiLatency));
    metrics.api5XXErrorMetrics.map(setAlerm(apigw.error5XX));

    metrics.lambdaConcurrentExecs.map(setAlerm(lambda.concurrentExecs));
    metrics.logsLambdaErrorLogCount.map(setAlerm(lambda.errorLogCounts));

    metrics.rdsProxyConnMetrics.map(setAlerm(rds.proxyConnections));
    metrics.rdsSlowQueryLogCount.map(setAlerm(rds.slowQueryLogCounts));

    metrics.sqsNumOfVisibleMessages.map(setAlerm(etc.sqsNumOfVisibleMessages));
    metrics.wafBlockedRequests.map(setAlerm(etc.wafBlockedRequests));
};