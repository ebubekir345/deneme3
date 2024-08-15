import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

export interface Config {
  env: string;
  isDev: boolean;
  isInt: boolean;
  isStaging: boolean;
  isSandbox: boolean;
  isProduction: boolean;
  isTest: boolean;
  isTest01: boolean;
  isTest02: boolean;
  isAnkara: boolean;
  isDilovasi: boolean;
  isUnitedKingdom: boolean;
  isTuzla: boolean;
  isTuzla01: boolean;
  isUSChicago: boolean;
  isGermany: boolean;
  authenticationUrl: string;
  i18n: {
    default: string;
    locales: Array<string>;
  };
  api: {
    url: string;
    terminalWebSocketUrl: string;
  };
  auth: Auth0ClientOptions;
  logger: {
    level: string;
    appinsights: {
      instrumentationKey: string;
    };
  };
  elastic: {
    serviceName: string;
    serverUrl: string;
    serviceVersion: string;
    environment: string;
  };
}
