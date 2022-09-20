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
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventService } from './event.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventItem } from 'type/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  displayedColumns: string[] = [
    'class',
    'count',
    'group',
    'severity',
    'source',
    // 'createdTime',
    'updatedTime',
    'operate',
  ];
  isLoadingResults: boolean = true;
  dataSource!: MatTableDataSource<EventItem>;
  total: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private eventService: EventService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getEventList();
  }
  getEventList() {
    Promise.resolve().then(() => {
      this.eventService.getList().subscribe(data => {
        const list = data;
        this.isLoadingResults = false;
        this.total = list.length;
        this.dataSource = new MatTableDataSource<EventItem>(list);
        this.dataSource.paginator = this.paginator;
      });
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  inspect(id: number) {
    this.router.navigate(['/event/detail'], {
      queryParams: { id },
    });
  }
  create() {
    this.router.navigate(['/trigger/create-prometheus-alert']);
  }
  delete(id: number, element: EventItem) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '780px',
      data: {
        type: 'Event',
        name: element.class,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.delete(id).subscribe(() => {
          this._snackBar.open('Delete Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.getEventList();
        });
      }
    });
  }
}
