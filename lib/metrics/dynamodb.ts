import { Duration } from 'aws-cdk-lib';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

import { DynamoDB } from 'params';

export const readCapacityMetrics = (): Metric[] => {
    return dynamoDbMetrics('ConsumedReadCapacityUnits')
}

export const writeCapacityMetrics = (): Metric[] => {
    return dynamoDbMetrics('ConsumedWriteCapacityUnits')
}

const dynamoDbMetrics = (metricName: string): Metric[] => {
    return DynamoDB.tableNames.map(
        tableName => new Metric({
            namespace: 'AWS/DynamoDB',
            metricName: metricName,
            dimensionsMap: {
                TableName: tableName
            },
            label: tableName,
            period: Duration.minutes(1),
        })
    );
}
