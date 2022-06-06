import {GraphWidget, GraphWidgetView, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

import * as params from 'params'
import {HealthCheck} from 'metrics/route53';

export const route53CfHealthChecks = (healthchecks: HealthCheck[]): GraphWidget => {
    return route53HealthChecks(
        healthchecks,
        '管理画面サービス ヘルスチェック',
    );
}

export const route53ApiGwHealthChecks = (healthchecks: HealthCheck[]): GraphWidget => {
    return route53HealthChecks(
        healthchecks,
        "ApiGateway ヘルスチェック",
    );
}

const route53HealthChecks = (
    healthchecks: HealthCheck[],
    title: string,
): GraphWidget => {
    const metrics = healthchecks.map(
        hc => new Metric({
            namespace: 'AWS/Route53',
            metricName: 'HealthCheckStatus',
            dimensionsMap: {
                HealthCheckId: hc.healthCheck.attrHealthCheckId,
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
