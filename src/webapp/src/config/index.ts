import { Config } from './config.model';

const defaultConfig = require('./config.default').config;

// eslint-disable-next-line import/no-dynamic-require
const envConfig = require(`./config.${defaultConfig.env}`).config;

export const config: Config = { ...defaultConfig, ...envConfig };
