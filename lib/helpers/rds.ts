import {Construct} from 'constructs';
import {DatabaseCluster, IDatabaseCluster} from 'aws-cdk-lib/aws-rds';

import * as params from 'params'
import {name} from 'utils'

export const importRdsClusters = (construct: Construct): IDatabaseCluster[] => {
    return params.RDS.clusters.map(
        cluster => DatabaseCluster.fromDatabaseClusterAttributes(
            construct,
            name(`imported-rds-cluster-${cluster.id}`),
            {
                clusterIdentifier: cluster.id,
                instanceIdentifiers: cluster.instanceIds,
            }
        ),
    );
}
