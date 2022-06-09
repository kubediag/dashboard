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
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisItem } from './../type/diagnosis';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss'],
})
export class DiagnosisComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'namespace',
    'name',
    'operationSet',
    'node',
    'status',
    'age',
    'operate',
  ];
  dataSource!: MatTableDataSource<DiagnosisItem>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private diagnosisList: DiagnosisService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.getDiagnosisList();
  }

  getDiagnosisList(): void {
    Promise.resolve().then(() => {
      this.diagnosisList.getList().subscribe(data => {
        const list = data;
        this.dataSource = new MatTableDataSource<DiagnosisItem>(list);
        this.dataSource.paginator = this.paginator;
      });
    });
  }
  edit(index: number): void {
    this.router.navigate([`/diagnosis/edit`], { queryParams: { id: index } });
  }

  delete(index: number, element: DiagnosisItem): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '780px',
      data: {
        type: 'Diagnosis',
        name: element.name,
        namespace: element.namespace,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagnosisList.delete(index).subscribe(() => {
          this._snackBar.open('Delete Success!', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.getDiagnosisList();
        });
      }
    });
  }
}
