export interface EventItem {
  class: string;
  count?: number;
  group: string;
  source: string;
  severity: string;
  createdTime: string;
  updatedTime?: string;
  name: string;
  summary?: string;
  customDetail?: object;
}

export interface EventRes {
  items: Event[];
  [key: string]: any;
}

export interface Event {
  metadata: {
    creationTimestamp: string;
    name: string;
  };
  spec: {
    class: string;
    customDetails: {
      firing: string;
      num_firing: string;
      num_resolved: string;
      resolved: string;
    };
    group: string;
    severity: string;
    source: string;
    summary: string;
  };
  status?: {
    count: number;
    lastUpdateTime: string;
  };
}
