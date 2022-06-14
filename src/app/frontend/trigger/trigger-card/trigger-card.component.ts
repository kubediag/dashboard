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

import { TriggerService } from './../trigger.service';
import { TriggerItem } from './../../type/trigger';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trigger-card',
  templateUrl: './trigger-card.component.html',
  styleUrls: ['./trigger-card.component.scss'],
})
export class TriggerCardComponent implements OnInit {
  @Input() item!: TriggerItem;
  @Input() id!: number;
  @Output() deleteItem = new EventEmitter();
  name: string = 'http-server-operation';
  constructor(private router: Router) {}

  ngOnInit(): void {}
  delete() {
    this.deleteItem.emit();
  }
  edit() {
    if (this.item.type! === 'PrometheusAlert') {
      this.router.navigate([`/trigger/edit-prometheus-alert`], {
        queryParams: { id: this.id },
      });
    } else if (this.item.type! === 'KubernetesEvent') {
      this.router.navigate([`/trigger/edit-kubernetes-event`], {
        queryParams: { id: this.id },
      });
    } else {
      this.router.navigate([`/trigger/edit-cron`], {
        queryParams: { id: this.id },
      });
    }
  }
}
