import { CreateOperationSetComponent } from './create-operation-set/create-operation-set.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationSetComponent } from './operation-set.component';

const routes: Routes = [
  { path: '', component: OperationSetComponent },
  { path: 'create', component: CreateOperationSetComponent },
  { path: 'edit', component: CreateOperationSetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationSetRoutingModule {}
