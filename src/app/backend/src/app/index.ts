/**
 * Copyright 2022 The KubeDiag Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
