import {Dashboard, GraphWidget, GraphWidgetView, Metric, Unit} from "aws-cdk-lib/aws-cloudwatch";
import {Function} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";


export const route53CFnHealthChecks = (dashboard: Dashboard) => {
    const metric = new Metric({
        namespace: 'AWS/Route53',
        metricName: 'HealthCheckStatus',
        dimensionsMap: {
            HealthCheckId: 'd074c66b-189b-4f97-9ff3-83ea343d1f37'
        }
    });

    dashboard.addWidgets(new GraphWidget({
        title: "管理画面サービス ヘルスチェック",
        region: 'us-east-1',
        left: [metric],
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
