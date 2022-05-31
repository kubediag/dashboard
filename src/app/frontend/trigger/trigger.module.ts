import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TriggerRoutingModule } from './trigger-routing.module';
import { TriggerComponent } from './trigger.component';
import { TriggerCardComponent } from './trigger-card/trigger-card.component';
import { CreateTriggerDialogComponent } from './create-trigger-dialog/create-trigger-dialog.component';
import { CreatePrometheusRuleComponent } from './create-prometheus-rule/create-prometheus-rule.component';
import { CreateKubernetesEventComponent } from './create-kubernetes-event/create-kubernetes-event.component';
import { CreateCronComponent } from './create-cron/create-cron.component';

@NgModule({
  declarations: [
    TriggerComponent,
    TriggerCardComponent,
    CreateTriggerDialogComponent,
    CreatePrometheusRuleComponent,
    CreateKubernetesEventComponent,
    CreateCronComponent,
  ],
  imports: [
    CommonModule,
    TriggerRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class TriggerModule {}
