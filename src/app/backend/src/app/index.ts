import Koa, { Context } from 'koa';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(cors()).use(bodyParser());

app.on('error', (err, ctx: Context) => {
  const status = 500;
  ctx.status = status;
  ctx.body = err;
});
export default app;
