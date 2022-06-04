import {Dashboard, GraphWidget, Unit} from "aws-cdk-lib/aws-cloudwatch";
import {Function} from "aws-cdk-lib/aws-lambda";

export const lambdaConcurrentExecs = (): GraphWidget => {
    return new GraphWidget({
        title: "Lambda関数の同時実行数",
        left: [Function.metricAllConcurrentExecutions({
            unit: Unit.COUNT
        })],
        width: 6
    })
}
