import { CronJob, CronTime } from 'cron';
import { getBiblia } from './biblia';
import { getCalendar } from './calendar';
import { config } from './config';
import { dateWithOffset, formatDateShort } from './date';

interface KalCache {
  calendar: {
    value: string;
    date: string;
  } | null;
  biblia: {
    value: string;
    date: string;
  } | null;
}

const cache: KalCache = {
  calendar: null,
  biblia: null,
};

export async function updateCache() {
  const [calendar, biblia] = await Promise.all([getCalendar(1), getBiblia(1)]);
  const date = formatDateShort(dateWithOffset(1));

  cache.calendar = calendar
    ? {
        value: calendar,
        date: date,
      }
    : null;

  cache.biblia = biblia
    ? {
        value: biblia,
        date: date,
      }
    : null;
}

export function getCacheValue(date: string, type: 'calendar' | 'biblia') {
  return cache[type]?.date === date ? (cache[type]?.value as string) : null;
}

export async function getCalendarWithCache(dateOffset = 1) {
  const date = formatDateShort(dateWithOffset(dateOffset));
  return getCacheValue(date, 'calendar') || (await getCalendar(dateOffset));
}

export async function getBibliaWithCache(dateOffset = 1) {
  const date = formatDateShort(dateWithOffset(dateOffset));
  return getCacheValue(date, 'biblia') || (await getBiblia(dateOffset));
}

CronJob.from({
  cronTime:
    config.cacheUpdateCron &&
    CronTime.validateCronExpression(config.cacheUpdateCron).valid
      ? config.cacheUpdateCron
      : '0 12 * * *',
  onTick: updateCache,
  timeZone: 'Europe/Moscow',
  start: true,
});

updateCache();
