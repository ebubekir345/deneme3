import { Config } from './config.model';

export const config: Partial<Config> = {
  api: {
    url: 'https://maestro-api.oplog.cloud/dilovasi',
    terminalWebSocketUrl: 'wss://terminal.ras.oplog.cloud/',
  },
  logger: {
    level: '',
    appinsights: {
      instrumentationKey: 'b9f39735-c1d9-4700-a559-d10706e963e5',
    },
  },
  auth: {
    userMetadataKey: 'https://app-mst-dilovasi-westeu.azurewebsites.net/user_metadata',
    userRole: 'https://app-mst-dilovasi-westeu.azurewebsites.net/roles',
    logout_uri: 'https://maestro-dilovasi.oplog.app/login',
    domain: 'oplog-maestro-dilovasi.eu.auth0.com',
    client_id: 'O779T5gIly2xPAqS8vPat6fVSzebBMec',
    redirect_uri: 'https://maestro-dilovasi.oplog.app/callback',
    audience: 'https://app-mst-dilovasi-westeu.azurewebsites.net',
    scope: 'openid email profile',
    leeway: 30,
  },
  elastic: {
    serviceName: 'Maestro WebApp Dilovasi',
    serverUrl: 'https://c70736125c33418187ef7ec8b1cc98d9.apm.westeurope.azure.elastic-cloud.com:443',
    serviceVersion: '1.0',
    environment: 'dilovasi',
  },
};
