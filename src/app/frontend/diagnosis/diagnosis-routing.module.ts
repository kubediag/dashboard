import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagnosisComponent } from './diagnosis.component';

const routes: Routes = [{ path: '', component: DiagnosisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosisRoutingModule {}
