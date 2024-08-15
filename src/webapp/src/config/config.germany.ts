import { Config } from './config.model';

export const config: Partial<Config> = {
  api: {
    url: 'https://maestro-api.oplog.cloud/germany',
    terminalWebSocketUrl: 'wss://terminal.ras.oplog.cloud/',
  },
  auth: {
    userMetadataKey: 'https://maestro-web.azurewebsites.net/user_metadata',
    userRole: 'https://maestro-web.azurewebsites.net/roles',
    logout_uri: 'https://maestro-germany.oplog.app/login',
    domain: 'oplog-maestro.eu.auth0.com',
    client_id: 'nfdVpyW4pu9VecM4cvyuaCX2gIR6HNS7',
    redirect_uri: 'https://maestro-germany.oplog.app/callback',
    audience: 'https://maestro-web.azurewebsites.net',
    scope: 'openid email profile',
    leeway: 30,
  },
  elastic: {
    serviceName: 'Maestro WebApp Germany',
    serverUrl: 'https://c70736125c33418187ef7ec8b1cc98d9.apm.westeurope.azure.elastic-cloud.com:443',
    serviceVersion: '1.0',
    environment: 'germany',
  },
};
