import { CreateAlarmOptions, ComparisonOperator, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { name } from 'utils';

export const healthCheck = (m: Metric): CreateAlarmOptions => {
    return {
        evaluationPeriods: 4,
        threshold: 1,
        datapointsToAlarm: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
        alarmName: name(`CloudFront ${m.label} Route53 HealthCheck`, ' '),
    }
};
