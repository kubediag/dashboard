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

export interface TriggerPromethuesAlert {
  id: number;
  name: string;
  operationSet: string;
  type: 'PrometheusAlert';
  age: string;
  nodeName?: string;
  alertName?: string;
  labels?: { key: string; value: string }[];
  annotations?: { key: string; value: string }[];
}
export interface TriggerKubernetesEvent {
  id: number;
  name: string;
  operationSet: string;
  type: 'KubernetesEvent';
  age: string;
  reason?: string;
  nodeName?: string;
  eventName?: string;
  eventNamespace?: string;
  eventMessage?: string;
}
export interface TriggerCron {
  id: number;
  name: string;
  operationSet: string;
  type: 'Cron';
  age: string;
  schedule?: string;
  nodeName?: string;
}

export type TriggerItem =
  | TriggerPromethuesAlert
  | TriggerKubernetesEvent
  | TriggerCron;

export interface TriggerRes {
  items: Trigger[];
  [key: string]: any;
}

export interface Trigger {
  metadata: {
    name: string;
    creationTimestamp: string;
  };
  spec: {
    operationSet: string;
    nodeName?: string;
    sourceTemplate: {
      prometheusAlertTemplate?: {
        regexp: {
          alertName: string;
          labels?: Record<string, string>;
          annotations?: Record<string, string>;
        };
      };
      kubernetesEventTemplate?: {
        regexp: {
          reason?: string;
          name?: string;
          namespace?: string;
          message?: string;
        };
      };
      cronTemplate?: {
        schedule: string;
      };
    };
  };
}
