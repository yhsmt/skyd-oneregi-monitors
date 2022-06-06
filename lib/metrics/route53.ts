import {Construct} from 'constructs';
import {GraphWidget, GraphWidgetView, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {
    Duration,
    aws_route53 as r53,
} from "aws-cdk-lib";

import * as params from 'params'
import {name} from 'utils'

export type HealthCheck = {
    healthCheck: r53.CfnHealthCheck,
    name: string
}

export const createHealthCheck = (
    construct: Construct,
    nameTrunk: string,
    hostDomainName: string,
    resourcePath: string,
): r53.CfnHealthCheck => {
    const props: r53.CfnHealthCheckProps = {
        healthCheckConfig: {
            type: 'HTTPS',
            port: 443,
            fullyQualifiedDomainName: hostDomainName,
            resourcePath: resourcePath,
            failureThreshold: 3,
            enableSni: true,

            // the properties below are optional
            /*
            alarmIdentifier: {
                name: 'name',
                region: 'region',
            },
            childHealthChecks: ['childHealthChecks'],
            healthThreshold: 123,
            insufficientDataHealthStatus: 'insufficientDataHealthStatus',
            inverted: false,
            ipAddress: 'ipAddress',
            measureLatency: false,
            regions: ['regions'],
            requestInterval: 123,
            routingControlArn: 'routingControlArn',
            searchString: 'searchString',
             */
        }
    };

    return new r53.CfnHealthCheck(
        construct,
        name('oneregi-health-check' + nameTrunk),
        props,
    );
}
