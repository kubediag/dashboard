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
import { CreateOperationDialogComponent } from './create-operation-dialog/create-operation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OperationService } from './operation.service';
import { OperationItem } from './../type/operation';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
})
export class OperationComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'scheme',
    'address',
    'port',
    'path',
    'timeoutSeconds',
    'operate',
  ];
  list: OperationItem[] = [];
  dataSource!: MatTableDataSource<OperationItem>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private OperationList: OperationService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getOperationList();
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateOperationDialogComponent, {
      width: '780px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'createHttpServer') {
        this.router.navigate(['/operation/create-httpServer']);
      }
      if (result === 'createScriptRunner') {
        this.router.navigate(['/operation/create-scriptRunner']);
      }
      if (result === 'createFunction') {
        this.router.navigate(['/operation/create-function']);
      }
    });
  }

  getOperationList(): void {
    Promise.resolve().then(() => {
      this.OperationList.getList().subscribe(list => {
        this.list = list;
        this.dataSource = new MatTableDataSource<OperationItem>(list);
        this.dataSource.paginator = this.paginator;
      });
    });
  }
  delete(id: number, element: OperationItem) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '780px',
      data: {
        type: 'Operation',
        name: element.name,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.OperationList.delete(id).subscribe(() => {
          this._snackBar.open('Delete Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.getOperationList();
        });
      }
    });
  }
}
