import {GraphWidget, GraphWidgetView, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

import * as params from 'params'

export const route53CfHealthChecks = (): GraphWidget => {
    return route53HealthChecks(
        params.Route53.cfHealthChecks,
        '管理画面サービス ヘルスチェック',
    )
}

export const route53ApiGwHealthChecks = (): GraphWidget => {
    return route53HealthChecks(
        params.Route53.apigwHealthChecks,
        "ApiGateway ヘルスチェック",
    )
}

const route53HealthChecks = (
    healthchecks: {name: string, id: string}[],
    title: string,
): GraphWidget => {
    const metrics = healthchecks.map(
        hc => new Metric({
            namespace: 'AWS/Route53',
            metricName: 'HealthCheckStatus',
            dimensionsMap: {
                HealthCheckId: hc.id
            },
            label: hc.name,
        })
    );

    return new GraphWidget({
        title: title,
        region: params.Region.VA,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(300),
    })
}
