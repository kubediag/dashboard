import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationRoutingModule } from './operation-routing.module';
import { OperationComponent } from './operation.component';

@NgModule({
  declarations: [OperationComponent],
  imports: [CommonModule, OperationRoutingModule],
})
export class OperationModule {}
