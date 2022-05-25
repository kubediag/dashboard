import { OperationSetRes } from './../type/operationSet';
import { getTimeAge } from './../utils/index';
import { map } from 'rxjs/operators';
import { DiagnosisItem, DiagnosisRes } from './../type/diagnosis';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  list: DiagnosisItem[] = [];
  rowList: any[] = [];
  constructor(private http: HttpClient) {}
  getList(): Observable<DiagnosisItem[]> {
    const result = this.http.get<DiagnosisRes>('/list', {
      params: {
        type: 'diagnoses',
      },
    });
    const normalizaData = map((val: DiagnosisRes) => {
      this.rowList = val.items;
      return val.items.map(item => {
        const result: DiagnosisItem = {
          name: item.metadata.name,
          namespace: item.metadata.namespace,
          operationSet: item.spec.operationSet,
          node: item.spec.nodeName,
          status: item.status.phase,
          age: getTimeAge(item.metadata.creationTimestamp),
          parameters: [],
          podName: item.spec.podReference?.name,
          podNamespace: item.spec.podReference?.namespace,
        };
        for (let key in item.spec.parameters) {
          result.parameters.push({
            key,
            value: item.spec.parameters[key],
          });
        }

        return result;
      });
    });
    const data = normalizaData(result);
    data.subscribe(data => {
      this.list = data;
    });

    return data;
  }
  create(data: object): Observable<unknown> {
    return this.http.post<DiagnosisRes>('/create', data, httpOptions);
  }
  getDiagnosis(id: string): Observable<DiagnosisItem> {
    const data = of(this.list[+id]);
    return data;
  }
  getRowDiagnosis(id: string): Observable<any> {
    const data = of(this.rowList[+id]);
    return data;
  }
  edit(data: object): Observable<unknown> {
    return this.http.post<DiagnosisRes>('/edit', data, httpOptions);
  }
  delete(index: number): Observable<unknown> {
    return this.http.post<DiagnosisRes>(
      '/delete',
      this.rowList[index],
      httpOptions
    );
  }

  getNamespaceList(): Observable<string[]> {
    const result = this.http.get<DiagnosisRes>('/getNamespaceList');
    const normalizaData = map((val: DiagnosisRes) =>
      val.items.map(item => item.metadata.name)
    );
    const data = normalizaData(result);
    return data;
  }
  getOperationSet(): Observable<string[]> {
    const result = this.http.get<OperationSetRes>('/list', {
      params: {
        type: 'operationsets',
      },
    });

    const normalizaData = map((val: OperationSetRes) => {
      return val.items.map(item => item.metadata.name);
    });
    const data = normalizaData(result);
    return data;
  }
  getNodeList(): Observable<string[]> {
    const result = this.http.get<DiagnosisRes>('/getNodeList');
    const normalizaData = map((val: DiagnosisRes) =>
      val.items.map(item => item.metadata.name)
    );
    const data = normalizaData(result);
    return data;
  }
  getPodList(ns: string): Observable<string[]> {
    const result = this.http.get<DiagnosisRes>('/getPodList', {
      params: {
        namespace: ns,
      },
    });
    const normalizaData = map((val: DiagnosisRes) =>
      val.items.map(item => item.metadata.name)
    );
    const data = normalizaData(result);
    return data;
  }
}
