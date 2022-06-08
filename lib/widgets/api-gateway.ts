import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import * as params from 'params'

export const apiGatewayRequests = (metrics: Metric[]): GraphWidget => {
    return apiGatewayWidget(
        'ApiGateway リクエスト数',
        metrics,
        'Sum',
    )
}

export const apiGatewayLatency = (metrics: Metric[]): GraphWidget => {
    return apiGatewayWidget(
        'ApiGateway レスポンスタイム',
        metrics,
        'Average',
    )
}

export const apiGateway5XXError = (metrics: Metric[]): GraphWidget => {
    return apiGatewayWidget(
        'ApiGateway 5XXエラー発生数',
        metrics,
        'Average',
    )
}

const apiGatewayWidget = (
    title: string,
    metrics: Metric[],
    statistic: string,
    ): GraphWidget => {
    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: statistic,
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    })
}
