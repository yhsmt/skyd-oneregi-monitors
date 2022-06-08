import { CreateAlarmOptions, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { name } from 'utils';

export const healthCheck = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 4,
        threshold: 1,
        datapointsToAlarm: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
        alarmName: name(`API Gateway ${m.label} Route53 HealthCheck`, ' '),
    }
};

export const apiLatency = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,
        threshold: 3000,       // ms
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        alarmName: name(`API Gateway ${m.label} Latency`, ' '),
    }
};

export const error5XX = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 1,
        threshold: 3000,       // ms
        comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        alarmName: name(`API Gateway ${m.label} 5XX Error`, ' '),
    }
};