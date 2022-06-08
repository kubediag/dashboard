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

import { K8sApiResponse } from './../type';
import { client, k8sCoreApi, k8sCustomApi } from './../app/k8s';
import Router from '@koa/router';
import { Context } from 'koa';
import { KubernetesObject } from '@kubernetes/client-node';
const router: Router = new Router({ prefix: '/api/kubediag' });

router.get('/list', async (ctx: Context) => {
  const { type } = ctx.request.query;
  const res: K8sApiResponse = await k8sCustomApi.listClusterCustomObject(
    'diagnosis.kubediag.org',
    'v1',
    type as string
  );
  ctx.body = res.body;
});

router.post('/create', async (ctx: Context) => {
  const spec = ctx.request.body as object;
  try {
    await client.create(spec);
    ctx.body = {
      code: 200,
    };
  } catch (e) {
    ctx.app.emit('error', (e as Record<string, object>).body, ctx);
  }
});

router.post('/edit', async (ctx: Context) => {
  const spec: KubernetesObject = ctx.request.body as KubernetesObject;
  try {
    // add patch request header
    const options = {
      headers: { 'Content-type': 'application/merge-patch+json' },
    };
    await client.patch(
      spec,
      undefined,
      undefined,
      undefined,
      undefined,
      options
    );

    ctx.body = {
      code: 200,
    };
  } catch (e) {
    ctx.app.emit('error', (e as Record<string, object>).body, ctx);
  }
});

router.post('/delete', async (ctx: Context) => {
  const spec = ctx.request.body as object;
  try {
    await client.delete(spec);
    ctx.body = {
      code: 200,
    };
  } catch (e) {
    ctx.app.emit('error', (e as Record<string, object>).body, ctx);
  }
});

router.get('/getNamespaceList', async (ctx: Context) => {
  const res = await k8sCoreApi.listNamespace();
  ctx.body = res.body;
});

router.get('/getNodeList', async (ctx: Context) => {
  const res = await k8sCoreApi.listNode();
  ctx.body = res.body;
});

router.get('/getPodList', async (ctx: Context) => {
  const { namespace } = ctx.request.query;
  const res = await k8sCoreApi.listNamespacedPod(namespace as string);
  ctx.body = res.body;
});
export default router;
