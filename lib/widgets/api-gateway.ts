import {GraphWidget, GraphWidgetView, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

import * as params from 'params'

export const apiGatewayRequests = (): GraphWidget => {
    return apiGatewayWidget(
        'ApiGateway リクエスト数',
        'Count',
        'Sum',
        60
    )
}

export const apiGatewayLatency = (): GraphWidget => {
    return apiGatewayWidget(
        'ApiGateway レスポンスタイム',
        'Latency',
        'Average',
        300
    )
}

export const apiGateway5XXError = (): GraphWidget => {
    return apiGatewayWidget(
        'ApiGateway 5XXエラー発生数',
        '5XXError',
        'Average',
        300
    )
}

const apiGatewayWidget = (
    title: string,
    metricName: string,
    statistic: string,
    period_sec: number,
    ): GraphWidget => {
    const metrics = params.ApiGateway.apis.map(
        api => new Metric({
            namespace: 'AWS/ApiGateway',
            metricName: metricName,
            dimensionsMap: {
                ApiName: api.name,
            },
            label: api.name,
        })
    );

    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: statistic,
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(period_sec),
    })
}
