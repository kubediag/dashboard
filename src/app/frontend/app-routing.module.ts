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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'diagnosis',
    pathMatch: 'full',
  },
  {
    path: 'diagnosis',
    loadChildren: () =>
      import('./diagnosis/diagnosis.module').then(m => m.DiagnosisModule),
  },
  {
    path: 'operation',
    loadChildren: () =>
      import('./operation/operation.module').then(m => m.OperationModule),
  },
  {
    path: 'operationSet',
    loadChildren: () =>
      import('./operation-set/operation-set.module').then(
        m => m.OperationSetModule
      ),
  },
  {
    path: 'trigger',
    loadChildren: () =>
      import('./trigger/trigger.module').then(m => m.TriggerModule),
  },
  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then(m => m.EventModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
