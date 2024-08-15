/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { addLocaleData } from 'react-intl';
import { config } from '../config';

const flattenMessages = (nestedMessages: any, prefix = '') => {
  if (nestedMessages === undefined) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};

export function getLocale(locale: string) {
  if (!config.i18n.locales.includes(locale)) {
    // eslint-disable-next-line no-param-reassign
    locale = config.i18n.default;
  }

  const tr = require(`react-intl/locale-data/tr`);
  const en = require(`react-intl/locale-data/en`);
  addLocaleData([...tr, ...en]);

  const commonMessages = require(`./locale/${locale}`);

  return {
    locale,
    messages: flattenMessages(commonMessages),
  };
}
