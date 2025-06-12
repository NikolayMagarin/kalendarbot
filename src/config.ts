import dotevn from 'dotenv';
import assert from 'assert';

dotevn.config();

function getEnvValue(key: string) {
  const val = process.env[key];
  assert(val, `Please set ${key} in environment`);
  return val;
}

export const config = {
  telegramToken: getEnvValue('TELEGRAM_TOKEN'),
  port: getEnvValue('PORT'),
  adminSecret: getEnvValue('ADMIN_SECRET'),
  usersAllowed: [1464486368, 2097992443],
};
