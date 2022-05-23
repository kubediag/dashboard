import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosisRoutingModule } from './diagnosis-routing.module';
import { DiagnosisComponent } from './diagnosis.component';

@NgModule({
  declarations: [DiagnosisComponent],
  imports: [CommonModule, DiagnosisRoutingModule],
})
export class DiagnosisModule {}
