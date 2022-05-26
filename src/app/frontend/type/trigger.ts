export interface TriggerPromethuesAlert {
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
