import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggerRoutingModule } from './trigger-routing.module';
import { TriggerComponent } from './trigger.component';

@NgModule({
  declarations: [TriggerComponent],
  imports: [CommonModule, TriggerRoutingModule],
})
export class TriggerModule {}
