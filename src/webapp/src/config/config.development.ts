import { Config } from './config.model';

export const config: Partial<Config> = {
  api: {
    url: 'http://localhost:8076',
    terminalWebSocketUrl: 'ws://192.168.48.94:80/',
  },
  auth: {
    userMetadataKey: 'https://maestro-web-int.azurewebsites.net/user_metadata',
    userRole: 'https://maestro-web-int.azurewebsites.net/roles',
    domain: 'oplog-maestro-int.eu.auth0.com',
    logout_uri: 'http://localhost:3000/login',
    client_id: 'weKr21Fc86GDIu0xRnre511Z1r3WK7s0',
    redirect_uri: 'http://localhost:3000/callback',
    audience: 'https://maestro-web-int.azurewebsites.net/',
    scope: 'openid email profile',
    leeway: 30,
  },
};
