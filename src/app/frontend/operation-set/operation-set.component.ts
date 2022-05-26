import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './../component/delete-dialog/delete-dialog.component';
import { OperationSetService } from './operation-set.service';
import { OperationSetItem } from './../type/operationSet';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-operation-set',
  templateUrl: './operation-set.component.html',
  styleUrls: ['./operation-set.component.scss'],
})
export class OperationSetComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'operations',
    'ready',
    'age',
    'operate',
  ];
  dataSource!: MatTableDataSource<OperationSetItem>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private operationSetService: OperationSetService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.getOperationSetList();
  }

  getOperationSetList(): void {
    Promise.resolve().then(() => {
      this.operationSetService.getList().subscribe(list => {
        this.dataSource = new MatTableDataSource<OperationSetItem>(list);
        this.dataSource.paginator = this.paginator;
      });
    });
  }
  edit(i: number): void {
    this.router.navigate([`/operationSet/edit`], { queryParams: { id: i } });
  }
  delete(id: number, element: OperationSetItem) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '780px',
      data: {
        type: 'OperationSet',
        name: element.name,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.operationSetService.delete(id).subscribe(() => {
          this._snackBar.open('Delete Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.getOperationSetList();
        });
      }
    });
  }
}
