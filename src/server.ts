import express, { RequestHandler } from 'express';
import { send } from '.';
import { config } from './config';
import path from 'path';

const useAdminSecret: RequestHandler = (req, res, next) => {
  if (req.body?.secret === config.adminSecret) {
    next();
  } else {
    res.status(403).json({ ok: false, data: 'Not allowed' });
  }
};
export const selfPingHandler: RequestHandler = (req, res) => {
  if (config.selfUrl) {
    setTimeout(selfPing, 3_000);
  }
  res.json({ ok: true, status: 'alive' });
};

function selfPing() {
  fetch(config.selfUrl + '/api/self-ping', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: config.adminSecret,
    }),
  }).catch();
}

export function startServer() {
  const app = express();
  const port = config.port;

  app.post('/tools/send', express.json(), useAdminSecret, function (req, res) {
    send()
      .then(() => {
        res.status(200).json({ ok: true });
      })
      .catch((err) => {
        res.status(500).json({ ok: false, data: err });
      });
  });

  app.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });

  app.post('/api/self-ping', express.json(), useAdminSecret, selfPingHandler);

  const publicPath = path.join(__dirname, '..', 'public');
  app.use('/', express.static(publicPath));

  const server = app.listen(port, () => {
    console.log('server started');

    selfPing();
  });

  app.get('/send/' + config.adminSecret, (req, res) => {
    res.status(200).send('sending');

    send();
  });

  return server;
}
