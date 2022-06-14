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

import { Router } from '@angular/router';
import { OperationItem } from './../../type/operation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-operation-card',
  templateUrl: './operation-card.component.html',
  styleUrls: ['./operation-card.component.scss'],
})
export class OperationCardComponent implements OnInit {
  @Input() item!: OperationItem;
  @Input() id!: number;
  @Output() deleteItem = new EventEmitter();
  name: string = 'http-server-operation';
  constructor(private router: Router) {}

  ngOnInit(): void {}
  delete() {
    this.deleteItem.emit();
  }
  edit() {
    if (this.item.type === 'HTTPServer') {
      this.router.navigate([`/operation/edit-httpServer`], {
        queryParams: { id: this.id },
      });
    } else if (this.item.type === 'Function') {
      this.router.navigate([`/operation/edit-function`], {
        queryParams: { id: this.id },
      });
    } else {
      this.router.navigate([`/operation/edit-scriptRunner`], {
        queryParams: { id: this.id },
      });
    }
  }
}
