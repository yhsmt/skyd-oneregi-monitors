import { Duration } from 'aws-cdk-lib';
import {Metric} from 'aws-cdk-lib/aws-cloudwatch';

import * as params from 'params'

export const sqsNumOfVisibleMessages = (): Metric[] => {
    return params.SQS.queueNames.map(
        qname => new Metric({
            namespace: 'AWS/SQS',
            metricName: 'ApproximateNumberOfMessagesVisible',
            dimensionsMap: {
                QueueName: qname
            },
            label: qname,
            period: Duration.minutes(1),
        })
    );
}

export const wafBlockedRequests = (): Metric[] => {
    return params.WAF.aclNames.map(
        acl => new Metric({
            namespace: 'AWS/WAFV2',
            metricName: 'BlockedRequests',
            dimensionsMap: {
                WebACL: acl,
                Region: params.Region.TKO,
                Rule: 'ALL'
            },
            label: acl,
            period: Duration.days(1),
            statistic: 'Sum',
            region: params.Region.TKO,
        })
    );
}
