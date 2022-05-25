import { CreateFunctionComponent } from './create-function/create-function.component';
import { CreateScriptRunnerComponent } from './create-script-runner/create-script-runner.component';
import { CreateHttpServerComponent } from './create-http-server/create-http-server.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationComponent } from './operation.component';

const routes: Routes = [
  { path: '', component: OperationComponent },
  {
    path: 'create-httpServer',
    component: CreateHttpServerComponent,
  },
  {
    path: 'edit-httpServer',
    component: CreateHttpServerComponent,
  },
  {
    path: 'create-scriptRunner',
    component: CreateScriptRunnerComponent,
  },
  {
    path: 'edit-scriptRunner',
    component: CreateScriptRunnerComponent,
  },
  {
    path: 'create-function',
    component: CreateFunctionComponent,
  },
  {
    path: 'edit-function',
    component: CreateFunctionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
