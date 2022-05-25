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
