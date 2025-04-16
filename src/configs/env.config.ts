import * as dotenv from 'dotenv';
import { CONFIG_TYPES } from './config.type';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export const config: CONFIG_TYPES = {
  APP: {
    PORT: parseInt(process.env.APP_PORT || '8000', 10),
    CORS_ALLOWED_ORIGINS: process.env.APP_CORS_ORIGINS?.split(',') || ['*'],
  },
  DATABASE: {
    HOST: process.env.DATABASE_HOST || 'localhost',
    PORT: parseInt(process.env.DATABASE_PORT || '27017', 10),
    USERNAME: process.env.DATABASE_USERNAME || '',
    PASSWORD: process.env.DATABASE_PASSWORD || '',
    NAME: process.env.DATABASE_NAME || 'cloak-service',
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    TTL: parseInt(process.env.REDIS_TTL || '86400', 10),
  },
};

export default config;
