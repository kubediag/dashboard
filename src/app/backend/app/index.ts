import Koa, { Context } from 'koa';
import Router from './../router/api.router';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

app
  .use(cors())
  .use(bodyParser())
  .use(Router.routes())
  .use(Router.allowedMethods());

app.on('error', (err, ctx: Context) => {
  const status = 500;
  ctx.status = status;
  ctx.body = err;
});
export default app;
