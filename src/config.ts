import dotevn from 'dotenv';
import assert from 'assert';

dotevn.config();

function getEnvValue(key: string, optional: true): string | undefined;
function getEnvValue(key: string, optional?: false): string;
function getEnvValue(key: string, optional = false) {
  const val = process.env[key];
  if (optional) return val;
  assert(val, `Please set ${key} in .env file`);
  return val;
}

interface Config {
  selfPingUrl: string | null;
  selfPingSecret: string | null;
  selfPingInterval: number | null;
  cacheUpdateCron: string | null;
}

export const config: Config = {
  selfPingUrl: getEnvValue('SELF_PING_URL', true) || null,
  selfPingSecret: getEnvValue('SELF_PING_SECRET', true) || null,
  selfPingInterval: Number(getEnvValue('SELF_PING_INTERVAL', true)) || null,
  cacheUpdateCron: getEnvValue('CACHE_UPDATE_CRON', true) || null,
};
