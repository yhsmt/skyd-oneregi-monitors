import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import * as params from 'params'

export const sqsNumOfVisibleMessages  = (metrics: Metric[]): GraphWidget => {
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

export const wafBlockedRequests  = (metrics: Metric[]): GraphWidget => {
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
