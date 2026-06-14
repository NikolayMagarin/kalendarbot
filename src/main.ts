import express from 'express';
import cors from 'cors';
import { selfPing, selfPingRouter } from './selfPing';
import { createHTML } from './createHTML';
import { getCalendar } from './calendar';
import { getBiblia } from './biblia';

const app = express();

app.get('/ping', (req, res) => res.status(200).send('pong'));
app.use(selfPingRouter);

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.send(
    createHTML([
      (await getCalendar(1)) || 'Не удалось получить',
      (await getBiblia(1)) || 'Не удалось получить',
    ])
  );
});

app.get('/today', async (req, res) => {
  res.send(
    createHTML([
      (await getCalendar(0)) || 'Не удалось получить',
      (await getBiblia(0)) || 'Не удалось получить',
    ])
  );
});

app.listen(80, () => {
  selfPing();
});
