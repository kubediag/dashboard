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

import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ErrorDialogComponent } from './error-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  public isDialogOpen: Boolean = false;
  constructor(private dialog: MatDialog) {}
  openDialog(data: any): any {
    if (this.isDialogOpen) {
      return false;
    }
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isDialogOpen = false;
      let animal;
      animal = result;
    });
  }
}
