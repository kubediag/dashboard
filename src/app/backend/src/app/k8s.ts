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

import {
  CoreV1Api,
  CustomObjectsApi,
  KubeConfig,
} from '@kubernetes/client-node';
import k8s = require('@kubernetes/client-node');

const kc: KubeConfig = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sCustomApi: CustomObjectsApi = kc.makeApiClient(
  k8s.CustomObjectsApi
);

export const k8sCoreApi: CoreV1Api = kc.makeApiClient(k8s.CoreV1Api);

export const client = k8s.KubernetesObjectApi.makeApiClient(kc);
