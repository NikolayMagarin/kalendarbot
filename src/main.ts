import express from 'express';
import cors from 'cors';
import { existsSync } from 'fs';
import { join } from 'path';
import { selfPing, selfPingRouter } from './selfPing';
import { getBibliaWithCache, getCalendarWithCache } from './cache';

type ContentBlock = {
  id: string;
  label: string;
  content: string;
};

const app = express();

app.set('views', resolveTemplatesDir());
app.set('view engine', 'pug');

app.get('/ping', (req, res) => res.status(200).send('pong'));
app.use(selfPingRouter);

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.render('page', await getPageData(1));
});

app.get('/today', async (req, res) => {
  res.render('page', await getPageData(0));
});

app.listen(80, () => {
  console.log('Server started on port 80');
  selfPing();
});

async function getPageData(daysOffset: number): Promise<{
  title: string;
  subtitle: string;
  blocks: ContentBlock[];
}> {
  return {
    title: 'Календарь',
    subtitle: 'Для копирования',
    blocks: [
      {
        id: 'pre1',
        label: 'Календарь',
        content: (await getCalendarWithCache(daysOffset)) || 'Не удалось получить данные',
      },
      {
        id: 'pre2',
        label: 'Чтения',
        content: (await getBibliaWithCache(daysOffset)) || 'Не удалось получить данные',
      },
    ],
  };
}

function resolveTemplatesDir(): string {
  const candidates = [
    join(__dirname, 'templates'),
    join(__dirname, '..', 'src', 'templates'),
  ];

  const templatesPath = candidates.find((candidate) => existsSync(candidate));
  if (!templatesPath) {
    throw new Error('Templates directory not found');
  }

  return templatesPath;
}
