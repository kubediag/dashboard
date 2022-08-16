import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventItem, EventRes } from './../type/event';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  list: EventItem[] = [];
  rowList: any[] = [];
  constructor(private http: HttpClient) {}
  getList(): Observable<EventItem[]> {
    const result = this.http.get<EventRes>('/list', {
      params: {
        type: 'commonevents',
      },
    });
    const normalizaData = map((val: EventRes) => {
      this.rowList = val.items;
      return val.items.map(item => {
        const result: EventItem = {
          name: item.metadata.name,
          class: item.spec.class,
          count: item.status?.count,
          group: item.spec.group,
          severity: item.spec.severity,
          source: item.spec.source,
          createdTime: item.metadata.creationTimestamp,
          updatedTime: item.status?.lastUpdateTime,
          customDetail: item.spec.customDetails,
          summary: item.spec.summary.replace(/\\n/g, '\n'),
        };
        return result;
      });
    });
    const data = normalizaData(result);
    data.subscribe(data => {
      this.list = data;
    });

    return data;
  }
  delete(index: number): Observable<unknown> {
    return this.http.post<EventRes>('/delete', this.rowList[index]);
  }
}
