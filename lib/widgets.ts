import {Dashboard, GraphWidget, GraphWidgetView, Metric, Unit} from "aws-cdk-lib/aws-cloudwatch";
import {Function} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";

import * as params from './params'

export const route53CfHealthChecks = (dashboard: Dashboard) => {
    route53HealthChecks(
        dashboard,
        params.Route53.cfHealthChecks,
        '管理画面サービス ヘルスチェック',
    )
}

export const route53ApiGwHealthChecks = (dashboard: Dashboard) => {
    route53HealthChecks(
        dashboard,
        params.Route53.apigwHealthChecks,
        "ApiGateway ヘルスチェック",
    )
}

const route53HealthChecks = (
    dashboard: Dashboard,
    healthchecks: {name: string, id: string}[],
    title: string,
) => {
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

    dashboard.addWidgets(new GraphWidget({
        title: title,
        region: 'us-east-1',
        left: metrics,
        width: 6,
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(300),
    }))
}

export const lambdaConcurrentExecs = (dashboard: Dashboard) => {
    dashboard.addWidgets(new GraphWidget({
        title: "Lambda関数の同時実行数",
        left: [Function.metricAllConcurrentExecutions({
            unit: Unit.COUNT
        })],
        width: 6
    }))
}
