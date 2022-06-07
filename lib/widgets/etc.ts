import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import * as params from 'params'

export const sqsNumOfVisibleMessages  = (): GraphWidget => {
    const metrics = params.SQS.queueNames.map(
        qname => new Metric({
            namespace: 'AWS/SQS',
            metricName: 'ApproximateNumberOfMessagesVisible',
            dimensionsMap: {
                QueueName: qname
            },
            label: qname,
        })
    );

    return new GraphWidget({
        title: 'SQS キュー滞留数',
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'SampleCount',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}

export const wafBlockedRequests  = (): GraphWidget => {
    const metrics = params.WAF.aclNames.map(
        acl => new Metric({
            namespace: 'AWS/WAFV2',
            metricName: 'BlockedRequests',
            dimensionsMap: {
                WebACL: acl,
                Region: params.Region.TKO,
                Rule: 'ALL'
            },
            label: acl,
            region: params.Region.TKO,
        })
    );

    return new GraphWidget({
        title: 'WAF ブロック数（API Gateway）',
        region: params.Region.VA,
        left: metrics,
        width: 6,
        statistic: 'Sum',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}
