import TelegramBot from 'node-telegram-bot-api';
import { startServer } from './server';
import { config } from './config';
import { CronJob } from 'cron';
import { getCalendar } from './lib/calendar';
import { getBiblia } from './lib/biblia';

const server = startServer();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, {
  polling: {
    autoStart: true,
    interval: 1000,
  },
});

bot.on('polling_error', (error) => {
  console.error(error);
  const errorMsg = error.message.toLowerCase();
  if (errorMsg.includes('409') && errorMsg.includes('conflict')) {
    bot.stopPolling();
    server.close();
  }
});

bot.on('text', (msg) => {
  if (!msg.from?.id) {
    bot.sendMessage(
      msg.chat.id,
      'У вас нет доступа к боту. Если вы считаете, что произошла ошибка, свяжитесь с @NikolayMagarin'
    );
    return;
  }
  if (!config.usersAllowed.includes(msg.from.id)) {
    bot.sendMessage(
      msg.chat.id,
      'У вас нет доступа к боту. Если вы считаете, что произошла ошибка, свяжитесь с @NikolayMagarin'
    );
    return;
  }

  if (msg.text === '/start') {
    bot.sendMessage(
      msg.chat.id,
      'Добро пожаловать. Бот присылает данные каждый день в 16:20 МСК'
    );
  }
});

export async function send() {
  const calendar = (await getCalendar()) || 'Не удалось получить данные';
  const biblia = (await getBiblia()) || 'Не удалось получить данные';
  config.usersAllowed.forEach(async (chatId) => {
    await bot.sendMessage(chatId, calendar);
    for (let i = 0; i < Math.ceil(biblia.length / 4096); i++) {
      await bot.sendMessage(chatId, biblia.slice(i * 4096, (i + 1) * 4096));
    }
  });
}

CronJob.from({
  cronTime: '20 16 * * *',
  onTick: send,
  timeZone: 'Europe/Moscow',
  start: true,
});
