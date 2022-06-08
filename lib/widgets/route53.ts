import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import * as params from 'params'

export const route53CfHealthChecks = (metrics: Metric[]): GraphWidget => {
    return route53HealthChecks(
        metrics,
        '管理画面サービス ヘルスチェック',
    );
}

export const route53ApiGwHealthChecks = (metrics: Metric[]): GraphWidget => {
    return route53HealthChecks(
        metrics,
        'ApiGateway ヘルスチェック',
    );
}

const route53HealthChecks = (
    metrics: Metric[],
    title: string,
): GraphWidget => {
    return new GraphWidget({
        title: title,
        region: params.Region.VA,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    })
}
