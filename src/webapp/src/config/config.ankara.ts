import { Config } from './config.model';

export const config: Partial<Config> = {
  api: {
    url: 'https://maestro-api.oplog.cloud/ankara',
    terminalWebSocketUrl: 'wss://terminal.ras.oplog.cloud/',
  },
  logger: {
    level: '',
    appinsights: {
      instrumentationKey: '',
    },
  },
  auth: {
    userMetadataKey: 'https://app-mst-dilovasi-westeu.azurewebsites.net/user_metadata',
    userRole: 'https://app-mst-dilovasi-westeu.azurewebsites.net/roles',
    logout_uri: 'https://maestro-ankara.oplog.app/login',
    domain: 'oplog-maestro-dilovasi.eu.auth0.com',
    client_id: 'O779T5gIly2xPAqS8vPat6fVSzebBMec',
    redirect_uri: 'https://maestro-ankara.oplog.app/callback',
    audience: 'https://app-mst-dilovasi-westeu.azurewebsites.net',
    scope: 'openid email profile',
    leeway: 30,
  },
  elastic: {
    serviceName: 'Maestro WebApp',
    serverUrl: 'https://c70736125c33418187ef7ec8b1cc98d9.apm.westeurope.azure.elastic-cloud.com:443',
    serviceVersion: '1.0',
    environment: 'ankara',
  },
};
