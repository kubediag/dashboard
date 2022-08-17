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

import { jsonToYaml } from './../../utils/index';
import { EventService } from './../event.service';
import { EventItem } from 'type/event';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  detail!: EventItem;
  customDetail = '';
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.detail = this.eventService.list[params['id']] || {};
      this.customDetail = await jsonToYaml(this.detail.customDetail);
    });
  }
  create() {
    this.router.navigate(['/trigger/create-prometheus-alert']);
  }
  cancel() {
    this.router.navigate(['/event']);
  }
}
