import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationSetRoutingModule } from './operation-set-routing.module';
import { OperationSetComponent } from './operation-set.component';

@NgModule({
  declarations: [OperationSetComponent],
  imports: [CommonModule, OperationSetRoutingModule],
})
export class OperationSetModule {}
