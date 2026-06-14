import express from 'express';
import cors from 'cors';
import { selfPing, selfPingRouter } from './selfPing';
import { createHTML } from './createHTML';
import { getBibliaWithCache, getCalendarWithCache } from './cache';

const app = express();

app.get('/ping', (req, res) => res.status(200).send('pong'));
app.use(selfPingRouter);

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.send(
    createHTML([
      (await getCalendarWithCache(1)) || 'Не удалось получить данные',
      (await getBibliaWithCache(1)) || 'Не удалось получить данные',
    ])
  );
});

app.get('/today', async (req, res) => {
  res.send(
    createHTML([
      (await getCalendarWithCache(0)) || 'Не удалось получить данные',
      (await getBibliaWithCache(0)) || 'Не удалось получить данные',
    ])
  );
});

app.listen(80, () => {
  selfPing();
});
