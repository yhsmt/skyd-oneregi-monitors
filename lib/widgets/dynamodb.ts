import {GraphWidget, GraphWidgetView, Metric} from 'aws-cdk-lib/aws-cloudwatch';
import {Duration} from 'aws-cdk-lib';

import { Region } from 'params';

export const dynamodbReadCapacity = (metrics: Metric[]): GraphWidget => {
    return dynamodbWidget( 'DynamoDB 読込ユニット消費量', metrics);
}

export const dynamodbWriteCapacity  = (metrics: Metric[]): GraphWidget => {
    return dynamodbWidget( 'DynamoDB 書込ユニット消費量', metrics);
}

const dynamodbWidget = (
    title: string,
    metrics: Metric[],
): GraphWidget => {
    return new GraphWidget({
        title: title,
        region: Region.TKO,
        left: metrics,
        width: 6,
        statistic: 'Average',
        view: GraphWidgetView.TIME_SERIES,
        period: Duration.minutes(1),
    });
}
