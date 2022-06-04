const appStage = process.env.CDK_APP_STAGE || "";
const stackName = appStage + '-oneregi-monitors-stack';
const prod = 'prod';
const stg = 'stg';

export const ApiGateway = {
    apiNames: [
        'prod-oneregi-app-api',
        'prod-oneregi-backend',
        'prod-oneregi-backend-managementScreen',
    ]
}

export const Common = {
    stackName: stackName,
    appStage: appStage,
    appStageProd: prod,
    appStageStg: stg,
    appStageIsProd: (appStage == prod),
    appStageIsStg: (appStage == stg),
    tags: {
        StackName: stackName,
        Environment: appStage,
    }
};

export const DynamoDB = {
    tableNames: [
        'prd_visitinformation_table',
        'prd_orderinformation_table',
        'prd_cashcheck_table',
        'prd_businessdayinformation_table',
        'prd_accountinginformation_table',
    ],
};

export const Lambda = {
    functionNames: [
        'oneregi-app-api-prod-app',
        'oneregi-backend-prod-app',
        'oneregi-backend-managementScreen-prod-app',
    ]
}

export const Region = {
    VA: 'us-east-1',
    TKO: 'ap-northeast-1',
}

export const RDS = {
    proxyNames: ['oneregi-prd-rdsproxy'],
    clusterNames: ['oneregi-prd-rds-cluster'],
    dbInstances: [
        'oneregi-prd-rds-01',
        'oneregi-prd-rds-02',
    ],
}

export const Route53 = {
    cfHealthChecks: [
        {
            name: 'oneregi-prd-frontend-healthcheck',
            id: 'd074c66b-189b-4f97-9ff3-83ea343d1f37',
        },
    ],
    apigwHealthChecks: [
        {
            name: 'prod-oneregi-app-api',
            id: '0691aa14-e8a7-4565-a1ac-c879cb23b5d8',
        }, {
            name: 'prod-oneregi-backend',
            id: 'f6ca7ace-6ff0-4549-9eaf-1919999af5a8',
        }, {
            name: 'prod-oneregi-backend-managementScreen',
            id: ' f26dd03d-c66d-4487-9640-e0688ad6e37e',
        },
    ],
}

export const SQS = {
    queueNames: ['oneregi-prd-app-001']
}

export const WAF = {
    aclNames: [
        'oneregi-app-api-prod',
        'oneregi-backend-api-prod',
        'oneregi-managementScreen-api-prod',
    ]
}
