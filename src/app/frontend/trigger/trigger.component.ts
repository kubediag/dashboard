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

import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from './../component/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateTriggerDialogComponent } from './create-trigger-dialog/create-trigger-dialog.component';
import { TriggerService } from './trigger.service';
import { TriggerItem } from './../type/trigger';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss'],
})
export class TriggerComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'namespace',
    'name',
    'operationSet',
    'node',
    'status',
    'age',
    'operate',
  ];
  list?: TriggerItem[];
  constructor(
    private TriggerService: TriggerService,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.getTriggerList();
  }

  getTriggerList(): void {
    Promise.resolve().then(() => {
      this.TriggerService.getList().subscribe(list => {
        this.list = list;
      });
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateTriggerDialogComponent, {
      width: '780px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'createPrometheusAlert') {
        this.router.navigate(['/trigger/create-prometheus-alert']);
      }
      if (result === 'createScriptKubernetesEvent') {
        this.router.navigate(['/trigger/create-kubernetes-event']);
      }
      if (result === 'createCron') {
        this.router.navigate(['/trigger/create-cron']);
      }
    });
  }
  delete(id: number, element: TriggerItem) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '780px',
      data: {
        type: 'Trigger',
        name: element.name,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.TriggerService.delete(id).subscribe(() => {
          this._snackBar.open('Delete Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.getTriggerList();
        });
      }
    });
  }
}
