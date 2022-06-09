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
