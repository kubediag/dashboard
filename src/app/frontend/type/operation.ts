export interface OperationHTTPServer {
  name: string;
  scheme: string;
  address?: string;
  port?: number;
  path?: string;
  url?: string;
  timeoutSeconds: number;
  type: 'HTTPServer';
}

export interface OperationScriptRunner {
  name: string;
  script?: string;
  argKeys?: string[];
  operationResultKey?: string;
  timeoutSeconds: number;
  type: 'ScriptRunner';
}

export interface CodeSourceItem {
  key: string;
  value: string;
}

export interface OperationFunction {
  name: string;
  timeoutSeconds: number;
  codeSource?: CodeSourceItem[];
  runtime?: string;
  type: 'Function';
}

export type OperationItem =
  | OperationHTTPServer
  | OperationScriptRunner
  | OperationFunction;

export interface OperationRes {
  items: Operation[];
  [key: string]: any;
}

export interface Operation {
  metadata: {
    name: string;
  };
  spec: {
    processor: {
      httpServer?: {
        scheme: string;
        address: string;
        port: number;
        path: string;
      };
      scriptRunner?: {
        script: string;
        argKeys: string[];
        operationResultKey: string;
      };
      function?: {
        codeSource: Record<string, string>;
        runtime: string;
      };
      timeoutSeconds: number;
    };
  };
}
