import { Config } from './config.model';

export const config: Partial<Config> = {
  api: {
    url: 'https://maestro-api.oplog.cloud/staging',
    terminalWebSocketUrl: 'wss://terminal.ras.oplog.cloud/',
  },
  logger: {
    level: '',
    appinsights: {
      instrumentationKey: 'b9f39735-c1d9-4700-a559-d10706e963e5',
    },
  },
  auth: {
    userMetadataKey: 'https://maestro-web-staging.azurewebsites.net/user_metadata',
    userRole: 'https://maestro-web-staging.azurewebsites.net/roles',
    logout_uri: 'https://maestro-staging.oplog.app/login',
    domain: 'oplog-maestro-staging.eu.auth0.com',
    client_id: '5p6M5o5ww03kBQY0G5F4jTmcjucRANxa',
    redirect_uri: 'https://maestro-staging.oplog.app/callback',
    audience: 'https://maestro-web-staging.azurewebsites.net/',
    scope: 'openid email profile',
    leeway: 30,
  },
  elastic: {
    serviceName: 'Maestro WebApp',
    serverUrl: 'https://c70736125c33418187ef7ec8b1cc98d9.apm.westeurope.azure.elastic-cloud.com:443',
    serviceVersion: '1.0',
    environment: 'staging',
  },
};
