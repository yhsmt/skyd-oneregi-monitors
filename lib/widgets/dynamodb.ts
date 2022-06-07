import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import * as params from 'params'

export const dynamodbReadCapacity = (): GraphWidget => {
    return dynamodbWidget(
        'DynamoDB 読込ユニット消費量',
        'ConsumedReadCapacityUnits',
    )
}

export const dynamodbWriteCapacity  = (): GraphWidget => {
    return dynamodbWidget(
        'DynamoDB 書込ユニット消費量',
        'ConsumedWriteCapacityUnits',
    )
}

const dynamodbWidget = (
    title: string,
    metricName: string,
): GraphWidget => {
    const metrics = params.DynamoDB.tableNames.map(
        tableName => new Metric({
            namespace: 'AWS/DynamoDB',
            metricName: metricName,
            dimensionsMap: {
                TableName: tableName
            },
        })
    );

    return new GraphWidget({
        title: title,
        region: params.Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.seconds(60),
    })
}
