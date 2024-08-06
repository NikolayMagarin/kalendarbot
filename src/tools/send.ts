import fetch from 'node-fetch';
import { config } from './config';

fetch(`${config.serverUrl}/tools/send`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    adminSecret: config.adminSecret,
  }),
})
  .then((res) => res.json())
  .then((body) => {
    console.log(`ok: ${body.ok}`);
    if (!body.ok) {
      console.log(body.data);
    }
  });
