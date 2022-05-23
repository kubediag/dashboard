import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationSetComponent } from './operation-set.component';

const routes: Routes = [{ path: '', component: OperationSetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationSetRoutingModule {}
