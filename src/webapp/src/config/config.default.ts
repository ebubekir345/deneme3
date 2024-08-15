import { Config } from './config.model';

const domainEnvMapping = {
  'maestro.oplog.app': 'production',
  'maestro-int.oplog.app': 'int',
  'maestro-staging.oplog.app': 'staging',
  'maestro-test.oplog.app': 'test',
  'maestro-test-01.oplog.app': 'test-01',
  'maestro-test-02.oplog.app': 'test-02',
  'maestro-ankara.oplog.app': 'ankara',
  'maestro-dilovasi.oplog.app': 'dilovasi',
  'maestro-automation.oplog.app': 'automation',
  'maestro-uk.oplog.app': 'unitedkingdom',
  'maestro-tuzla.oplog.app': 'tuzla',
  'maestro-tuzla-01.oplog.app': 'tuzla01',
  'maestro-sandbox.oplog.app': 'sandbox',
  'maestro-chicago.oplog.app': 'uschicago',
  'maestro-germany.oplog.app': 'germany',
};

export const chatbotApiKeys = {
  production: 'NLRvBFQ8hV5x6PfcMiDYAv6OMSgUF7HB7BXJDE61',
  dilovasi: 'WYhBapFeoLEwGIj4VlECFgXj6yPXGmcOymeeWNPF',
  common: '71teqm668pd3yNhuf1kNw8wVipPRvFSKw9QCFLZ6',
};

let domain = window.location.hostname;
let env = domainEnvMapping[domain] ? domainEnvMapping[domain] : 'development';

const liveDomains = {
  isProduction: env === 'production',
  isDilovasi: env === 'dilovasi',
  isUnitedKingdom: env === 'unitedkingdom',
  isTuzla: env === 'tuzla',
  isTuzla01: env === 'tuzla01',
  isAnkara: env === 'ankara',
  isUSChicago: env === 'uschicago',
  isGermany: env === 'germany',
};
export const isBarcodeDebuggingEnabled = !Object.values(liveDomains).some(domain => domain);

export const config: Partial<Config> = {
  env,
  isDev: env === 'development',
  isInt: env === 'int',
  isStaging: env === 'staging',
  isSandbox: env === 'sandbox',
  isProduction: env === 'production',
  isTest: env === 'test',
  isTest01: env === 'test-01',
  isTest02: env === 'test-02',
  isAnkara: env === 'ankara',
  isDilovasi: env === 'dilovasi',
  isUnitedKingdom: env === 'unitedkingdom',
  isTuzla: env === 'tuzla',
  isTuzla01: env === 'tuzla01',
  isUSChicago: env === 'uschicago',
  isGermany: env === 'germany',
  i18n: {
    default: 'tr-TR',
    locales: ['tr-TR', 'en-US'],
  },
};
