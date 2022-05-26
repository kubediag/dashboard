import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { OperationComponent } from './operation.component';
import { OperationCardComponent } from './operation-card/operation-card.component';
import { CreateOperationDialogComponent } from './create-operation-dialog/create-operation-dialog.component';
import { CreateHttpServerComponent } from './create-http-server/create-http-server.component';
import { CreateScriptRunnerComponent } from './create-script-runner/create-script-runner.component';
import { CreateFunctionComponent } from './create-function/create-function.component';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OperationComponent,
    OperationCardComponent,
    CreateOperationDialogComponent,
    CreateHttpServerComponent,
    CreateScriptRunnerComponent,
    CreateFunctionComponent,
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatRippleModule,
    MatTabsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
})
export class OperationModule {}
