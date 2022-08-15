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

export interface ParameterItem {
  key: string;
  value?: string;
}

export interface DiagnosisItem {
  namespace: string;
  name: string;
  operationSet?: string;
  node?: string;
  status: string;
  age: string;
  podName?: string;
  podNamespace?: string;
  yaml?: string;
  parameters?: ParameterItem[];
  items?: [];
}

export interface DiagnosisRes {
  items: Diagnosis[];
  [key: string]: any;
}

export interface Diagnosis {
  metadata: {
    name: string;
    namespace: string;
    creationTimestamp: string;
  };
  spec?: {
    operationSet: string;
    nodeName?: string;
    parameters?: Record<string, string>;
    podReference?: {
      name: string;
      namespace: string;
    };
  };
  status?: {
    phase: string;
  };
}
