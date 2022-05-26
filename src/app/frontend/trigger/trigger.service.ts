import { OperationSetRes } from './../type/operationSet';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  TriggerItem,
  TriggerRes,
  TriggerPromethuesAlert,
} from './../type/trigger';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getTimeAge } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class TriggerService {
  list: TriggerItem[] = [];
  rowList: any[] = [];
  constructor(private http: HttpClient) {}
  getList(): Observable<TriggerItem[]> {
    const result = this.http.get<TriggerRes>('/list', {
      params: {
        type: 'triggers',
      },
    });
    const normalizeData = map((val: TriggerRes): TriggerItem[] => {
      this.rowList = val.items;
      return val.items.map(item => {
        if (item.spec.sourceTemplate.prometheusAlertTemplate) {
          const result: TriggerPromethuesAlert = {
            name: item.metadata.name,
            operationSet: item.spec.operationSet,
            type: 'PrometheusAlert',
            age: getTimeAge(item.metadata.creationTimestamp),
            nodeName: item.spec.nodeName,
            labels: [],
            annotations: [],
            alertName:
              item.spec.sourceTemplate.prometheusAlertTemplate.regexp.alertName,
          };
          for (let key in item.spec.sourceTemplate.prometheusAlertTemplate
            .regexp.labels) {
            result.labels?.push({
              key,
              value:
                item.spec.sourceTemplate.prometheusAlertTemplate.regexp.labels[
                  key
                ],
            });
          }
          for (let key in item.spec.sourceTemplate.prometheusAlertTemplate
            .regexp.annotations) {
            result.annotations?.push({
              key,
              value:
                item.spec.sourceTemplate.prometheusAlertTemplate.regexp
                  .annotations[key],
            });
          }
          return result;
        } else if (item.spec.sourceTemplate.kubernetesEventTemplate) {
          return {
            name: item.metadata.name,
            operationSet: item.spec.operationSet,
            type: 'KubernetesEvent',
            age: getTimeAge(item.metadata.creationTimestamp),
            nodeName: item.spec.nodeName,
            eventName:
              item.spec.sourceTemplate.kubernetesEventTemplate.regexp.name,
            eventNamespace:
              item.spec.sourceTemplate.kubernetesEventTemplate.regexp.namespace,
            eventMessage:
              item.spec.sourceTemplate.kubernetesEventTemplate.regexp.message,
            reason:
              item.spec.sourceTemplate.kubernetesEventTemplate.regexp.reason,
          };
        } else {
          return {
            name: item.metadata.name,
            operationSet: item.spec.operationSet,
            type: 'Cron',
            nodeName: item.spec.nodeName,
            age: getTimeAge(item.metadata.creationTimestamp),
            schedule: item.spec.sourceTemplate.cronTemplate?.schedule,
          };
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
    return this.http.post<TriggerRes>('/create', data);
  }
  getTrigger(id: string): Observable<TriggerItem> {
    const data = of(this.list[+id]);
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
  getRowTrigger(id: string): Observable<any> {
    const data = of(this.rowList[+id]);
    return data;
  }
  edit(data: object): Observable<unknown> {
    return this.http.post<TriggerRes>('/edit', data);
  }
  delete(index: number): Observable<unknown> {
    return this.http.post<TriggerRes>('/delete', this.rowList[index]);
  }
}
