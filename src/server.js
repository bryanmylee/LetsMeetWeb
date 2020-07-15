import { config } from 'dotenv';
config();
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
const {
  API_URL,
  ACCESS_TOKEN_SECRET,
} = process.env;

export default polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: () => ({
        API_URL,
        ACCESS_TOKEN_SECRET
      }),
    }),
  )
  .listen(PORT, err => {
    if (err) console.log('error', err);
  });
