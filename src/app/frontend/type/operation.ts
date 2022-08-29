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

export interface OperationHTTPServer {
  id: number;
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
  id: number;
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
  id: number;
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
