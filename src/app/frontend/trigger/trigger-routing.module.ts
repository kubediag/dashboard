import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TriggerComponent } from './trigger.component';

const routes: Routes = [{ path: '', component: TriggerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriggerRoutingModule {}
