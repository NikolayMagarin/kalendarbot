import TelegramBot from 'node-telegram-bot-api';
import { startServer } from './server';
import { config } from './config';
import { CronJob } from 'cron';
import { globalData } from './lib/global-data';
import { getCalendar } from './lib/calendar';
import { getBiblia } from './lib/biblia';

const keepAliveServer = startServer();

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
    keepAliveServer?.close();
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
  if (!config.usersAllowed.includes(msg.from?.id)) {
    bot.sendMessage(
      msg.chat.id,
      'У вас нет доступа к боту. Если вы считаете, что произошла ошибка, свяжитесь с @NikolayMagarin'
    );
    return;
  } else {
    if (msg.text === '/start') {
      globalData.chatData[msg.chat.id] = { quote: '', dialogState: 0 };
      if (!globalData.chatIds.includes(msg.chat.id)) {
        globalData.chatIds.push(msg.chat.id);
      }
    }
  }
});

export async function send() {
  const calendar = (await getCalendar()) || 'Не удалось получить данные';
  const biblia = (await getBiblia()) || 'Не удалось получить данные';
  globalData.chatIds.forEach(async (chatId) => {
    await bot.sendMessage(chatId, calendar);

    for (let i = 0; i < Math.ceil(biblia.length / 4096); i++) {
      await bot.sendMessage(chatId, biblia.slice(i * 4096, (i + 1) * 4096));
    }
    /*
    bot.sendMessage(chatId, biblia, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Цитата',
              callback_data: JSON.stringify({
                chatId: chatId,
                action: 'bible-quote',
              }),
            },
          ],
        ],
      },
    });
    */
  });
}

CronJob.from({
  // cronTime: '*/10 * * * * *',
  cronTime: '40 16 * * *',
  onTick: send,
  timeZone: 'Europe/Moscow',
  start: true,
});

bot.on('callback_query', (query) => {
  if (!query.data) {
    return;
  }

  const data = JSON.parse(query.data);

  if (data.action === 'bible-quote') {
    bot.sendMessage(data.chatId, 'Отправьте текст для цитаты');
    globalData.chatData[data.chatId].dialogState = 1;
  }

  bot.answerCallbackQuery(query.id);
  // bot.answerCallbackQuery(query.id, { text: 'some text' });
});
