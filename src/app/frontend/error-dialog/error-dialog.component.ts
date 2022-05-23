import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
})
export class ErrorDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: HttpErrorResponse) {}

  ngOnInit(): void {}
}
