import { TriggerService } from './../trigger.service';
import { TriggerItem } from './../../type/trigger';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trigger-card',
  templateUrl: './trigger-card.component.html',
  styleUrls: ['./trigger-card.component.scss'],
})
export class TriggerCardComponent implements OnInit {
  type?: string;
  @Input() item!: TriggerItem;
  @Input() id!: number;
  @Output() deleteItem = new EventEmitter();
  name: string = 'http-server-operation';
  constructor(private triggerService: TriggerService, private router: Router) {}

  ngOnInit(): void {
    this.type = 'Cron';
  }
  delete() {
    this.deleteItem.emit();
  }
  edit() {
    if (this.item.type === 'PrometheusAlert') {
      this.router.navigate([`/trigger/edit-prometheus-alert`], {
        queryParams: { id: this.id },
      });
    } else if (this.item.type === 'KubernetesEvent') {
      this.router.navigate([`/trigger/edit-kubernetes-event`], {
        queryParams: { id: this.id },
      });
    } else {
      this.router.navigate([`/trigger/edit-cron`], {
        queryParams: { id: this.id },
      });
    }
  }
}
