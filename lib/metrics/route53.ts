import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

import * as r53h from 'helpers/route53'

export const getHealthCheckMetrics = (
    hcAndNames: r53h.HealthCheckWithName[]
): Metric[] => {
    return hcAndNames.map(
        hcn => new Metric({
            namespace: 'AWS/Route53',
            metricName: 'HealthCheckStatus',
            dimensionsMap: {
                HealthCheckId: hcn.healthCheck.attrHealthCheckId,
            },
            label: hcn.name,
        })
    );
}
