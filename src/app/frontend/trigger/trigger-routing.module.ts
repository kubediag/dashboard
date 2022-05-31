import { CreateCronComponent } from './create-cron/create-cron.component';
import { CreateKubernetesEventComponent } from './create-kubernetes-event/create-kubernetes-event.component';
import { CreatePrometheusRuleComponent } from './create-prometheus-rule/create-prometheus-rule.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TriggerComponent } from './trigger.component';

const routes: Routes = [
  { path: '', component: TriggerComponent },
  {
    path: 'create-prometheus-alert',
    component: CreatePrometheusRuleComponent,
  },
  {
    path: 'edit-prometheus-alert',
    component: CreatePrometheusRuleComponent,
  },
  {
    path: 'create-kubernetes-event',
    component: CreateKubernetesEventComponent,
  },
  {
    path: 'edit-kubernetes-event',
    component: CreateKubernetesEventComponent,
  },
  {
    path: 'create-cron',
    component: CreateCronComponent,
  },
  {
    path: 'edit-cron',
    component: CreateCronComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriggerRoutingModule {}
