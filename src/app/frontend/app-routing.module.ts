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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
