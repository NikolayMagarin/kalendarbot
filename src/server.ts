import express, { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { send } from '.';
import { config } from './config';
import { globalData, redefineData } from './lib/global-data';

const useAdminSecret: RequestHandler = (req, res, next) => {
  if (req.body?.adminSecret === config.adminSecret) {
    next();
  } else {
    res.status(403).json({ ok: false, data: 'Not allowed' });
  }
};

const useSelfPingSecret: RequestHandler = (req, res, next) => {
  if (req.body?.selfPingSecret === config.selfPingSecret) {
    next();
  } else {
    res.status(403).json({ ok: false, data: 'Not allowed' });
  }
};

export function startServer() {
  const app = express();
  const port = config.port;
  const selfUrl = process.env.SELF_URL || `http://localhost:${port}`;

  app
    .post('/self-ping', express.json(), useSelfPingSecret, function (req, res) {
      setTimeout(() => {
        fetch(selfUrl + '/self-ping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selfPingSecret: config.selfPingSecret,
          }),
        }).catch();
      }, 30_000);
      res.json({ ok: true, status: 'alive' });
    })
    .post(
      '/tools/global-data/save',
      express.json(),
      useAdminSecret,
      function (req, res) {
        res.status(200).json({ ok: true, data: globalData });
      }
    )
    .post(
      '/tools/global-data/restore',
      express.json(),
      useAdminSecret,
      function (req, res) {
        // TODO: сделать проверку валидности приходящих данных (npm i joi)
        // res.status(400).json({ ok: false, data: 'invalid data' });
        redefineData(req.body.data);
        res.status(200).json({ ok: true });
      }
    )
    .post('/tools/send', express.json(), useAdminSecret, function (req, res) {
      send()
        .then(() => {
          res.status(200).json({ ok: true });
        })
        .catch((err) => {
          res.status(200).json({ ok: false, data: err });
        });
    });

  const server = app.listen(port, () => {
    console.log('server started');
  });

  fetch(selfUrl + '/self-ping', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selfPingSecret: config.selfPingSecret,
    }),
  })
    .then(() => {
      console.log('self ping loop activated');
    })
    .catch((err) => {
      console.error(err);
      console.log('cannot activate self ping loop');
    });

  return server;
}
