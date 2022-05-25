export interface ParameterItem {
  key: string;
  value: string;
}

export interface DiagnosisItem {
  namespace: string;
  name: string;
  operationSet: string;
  node: string;
  status: string;
  age: string;
  podName?: string;
  podNamespace?: string;
  yaml?: string;
  parameters: ParameterItem[];
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
  spec: {
    operationSet: string;
    nodeName: string;
    parameters?: Record<string, string>;
    podReference?: {
      name: string;
      namespace: string;
    };
  };
  status: {
    phase: string;
  };
}
