import {Construct} from 'constructs';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';

import * as r53h from 'helpers/route53'

export const getCfHealthCheckMetrics = (construct: Construct): Metric[] => {
    return getHealthCheckMetrics(
        r53h.getCfHealthChecks(construct)
    );
}

export const getApiHealthCheckMetrics = (construct: Construct): Metric[] => {
    return getHealthCheckMetrics(
        r53h.getApiHealthChecks(construct)
    );
}

const getHealthCheckMetrics = (
    hcAndNames: r53h.HealthCheckAndName[]
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
