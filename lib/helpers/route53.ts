import {Construct} from 'constructs';
import {
    Aws,
    aws_route53 as r53,
} from "aws-cdk-lib";

import {ImportedApi, importRestApis} from 'helpers/api-gateway'

import * as params from 'params';
import {name} from 'utils'

export type HealthCheckWithName = {
    healthCheck: r53.CfnHealthCheck,
    name: string
}

export const getApiHealthChecks = (construct: Construct): HealthCheckWithName[] => {
    const restApis: ImportedApi[] = importRestApis(construct);
    return restApis.map(
        restApi => {
          return {
            healthCheck: createHealthCheck(
                construct,
                `rest-api-${restApi.api.restApiId}`,
                `${restApi.api.restApiId}.execute-api.${Aws.REGION}.amazonaws.com`,
                `/${(restApi.api.deploymentStage ?? 'prod')}/ping`
            ),
            name: restApi.name,
          };
        }
    );
  }

export const getCfHealthChecks = (construct: Construct): HealthCheckWithName[] => {
    return params.CloudFront.distURLs.map(
        cfdURL => {
          return {
            healthCheck: createHealthCheck(
                construct, `cf-${cfdURL}`, cfdURL, '/'
            ),
            name: cfdURL,
          }
        }
    );
  }


const createHealthCheck = (
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
        name(`oneregi-health-check-${nameTrunk}`),
        props,
    );
}
