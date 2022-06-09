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

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  OperationItem,
  OperationRes,
  OperationHTTPServer,
  OperationScriptRunner,
  OperationFunction,
} from './../type/operation';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  list: OperationItem[] = [];
  rowList: any[] = [];
  constructor(private http: HttpClient) {}
  getList(): Observable<OperationItem[]> {
    const result = this.http.get<OperationRes>('/list', {
      params: {
        type: 'operations',
      },
    });
    const normalizeData = map((val: OperationRes): OperationItem[] => {
      this.rowList = val.items;
      return val.items.map(item => {
        if (item.spec.processor.httpServer) {
          const scheme = item.spec.processor.httpServer?.scheme;
          const address = item.spec.processor.httpServer?.address || '0.0.0.0';
          const port = item.spec.processor.httpServer?.port || 8090;
          return {
            name: item.metadata.name,
            scheme: scheme,
            address: address,
            port: port,
            path: item.spec.processor.httpServer?.path,
            url:
              item.spec.processor.httpServer?.scheme +
              '://' +
              address +
              ':' +
              port +
              item.spec.processor.httpServer?.path,
            timeoutSeconds: item.spec.processor.timeoutSeconds,
            type: 'HTTPServer',
          };
        } else if (item.spec.processor.scriptRunner) {
          return {
            name: item.metadata.name,
            timeoutSeconds: item.spec.processor.timeoutSeconds,
            script: item.spec.processor.scriptRunner?.script,
            argKeys: item.spec.processor.scriptRunner?.argKeys,
            operationResultKey:
              item.spec.processor.scriptRunner?.operationResultKey,
            type: 'ScriptRunner',
          };
        } else {
          const data: OperationFunction = {
            name: item.metadata.name,
            runtime: item.spec.processor.function?.runtime,
            codeSource: [],
            timeoutSeconds: item.spec.processor.timeoutSeconds,
            type: 'Function',
          };
          for (let key in item.spec.processor.function?.codeSource) {
            data.codeSource?.push({
              key,
              value: item.spec.processor.function?.codeSource[key] || '',
            });
          }
          return data;
        }
      });
    });
    const data = normalizeData(result);
    data.subscribe(data => {
      this.list = data;
    });
    return data;
  }
  create(data: object): Observable<unknown> {
    return this.http.post<OperationRes>('/create', data);
  }
  getOperation(id: string): Observable<OperationItem> {
    const data = of(this.list[+id]);
    return data;
  }
  getRowDiagnosis(id: string): Observable<any> {
    const data = of(this.rowList[+id]);
    return data;
  }
  edit(data: object): Observable<unknown> {
    return this.http.post<OperationRes>('/edit', data);
  }
  delete(index: number): Observable<unknown> {
    return this.http.post<OperationRes>('/delete', this.rowList[index]);
  }

  createHttpServerParams(params: OperationHTTPServer): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Operation',
      metadata: {
        name: params.name,
      },
      spec: {
        processor: {
          timeoutSeconds: params.timeoutSeconds || 30,
          httpServer: {
            address: params.address || '0.0.0.0',
            scheme: params.scheme,
            port: params.port || 8090,
            path: params.path,
          },
        },
      },
    };
    return result;
  }

  createScriptRunnerParams(params: OperationScriptRunner): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Operation',
      metadata: {
        name: params.name,
      },
      spec: {
        processor: {
          timeoutSeconds: params.timeoutSeconds || 30,
          scriptRunner: {
            operationResultKey: params.operationResultKey,
            script: params.script,
            argKeys: params.argKeys,
          },
        },
      },
    };
    return result;
  }
}
