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

import { getTimeAge } from './../utils/index';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { OperationSetItem, OperationSetRes } from './../type/operationSet';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationSetService {
  list: OperationSetItem[] = [];
  rowList: any[] = [];
  constructor(private http: HttpClient) {}
  getList(): Observable<OperationSetItem[]> {
    const result = this.http.get<OperationSetRes>('/list', {
      params: {
        type: 'operationsets',
      },
    });
    const normalizeData = map((val: OperationSetRes): OperationSetItem[] => {
      this.rowList = val.items;
      return val.items.map(item => ({
        name: item.metadata.name,
        operations: item.status?.paths,
        adjacency: item.spec.adjacencyList,
        ready: item.status?.ready,
        age: getTimeAge(item.metadata.creationTimestamp),
      }));
    });
    const data = normalizeData(result);
    data.subscribe(data => {
      this.list = data;
    });
    return data;
  }
  create(data: object): Observable<unknown> {
    return this.http.post<OperationSetRes>('/create', data);
  }
  getOperationSet(id: string): Observable<OperationSetItem> {
    const data = of(this.list[+id]);
    return data;
  }
  getRowOperationSet(id: string): Observable<any> {
    const data = of(this.rowList[+id]);
    return data;
  }

  edit(data: object): Observable<unknown> {
    return this.http.post<OperationSetRes>('/edit', data);
  }
  delete(index: number): Observable<unknown> {
    return this.http.post<OperationSetRes>('/delete', this.rowList[index]);
  }
}
