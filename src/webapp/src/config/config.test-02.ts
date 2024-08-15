import { Config } from './config.model';

export const config: Partial<Config> = {
  api: {
    url: 'https://maestro-api.oplog.cloud/test02',
    terminalWebSocketUrl: 'wss://terminal.ras.oplog.cloud/',
  },
  logger: {
    level: '',
    appinsights: {
      instrumentationKey: '',
    },
  },
  auth: {
    userMetadataKey: 'https://maestro-web-int.azurewebsites.net/user_metadata',
    userRole: 'https://maestro-web-int.azurewebsites.net/roles',
    logout_uri: 'https://maestro-test-02.oplog.app/login',
    domain: 'oplog-maestro-int.eu.auth0.com',
    client_id: 'weKr21Fc86GDIu0xRnre511Z1r3WK7s0',
    redirect_uri: 'https://maestro-test-02.oplog.app/callback',
    audience: 'https://maestro-web-int.azurewebsites.net/',
    scope: 'openid email profile',
    leeway: 30,
  },
  elastic: {
    serviceName: 'Maestro WebApp',
    serverUrl: 'https://c70736125c33418187ef7ec8b1cc98d9.apm.westeurope.azure.elastic-cloud.com:443',
    serviceVersion: '1.0',
    environment: 'test-02',
  },
};
