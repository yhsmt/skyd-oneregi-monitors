#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { OneregiMonitorsStack } from 'oneregi-monitors-stack';
import { lackOfEnvironmentVals } from "utils";
import * as params from "params";

if (lackOfEnvironmentVals()) {
    throw new Error('lack of environment variables.');
}

const app = new cdk.App();

const stack = new OneregiMonitorsStack(app, params.Common.stackName);

const tags = params.Common.tags;
let k: keyof typeof tags;
for (k in tags) {
    cdk.Tags.of(stack).add(k, tags[k]);
}
