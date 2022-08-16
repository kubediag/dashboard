import { jsonToYaml } from './../../utils/index';
import { EventService } from './../event.service';
import { EventItem } from 'type/event';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  detail!: EventItem;
  customDetail = '';
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.detail = this.eventService.list[params['id']] || {};
      this.customDetail = await jsonToYaml(this.detail.customDetail);
    });
  }
  create() {
    this.router.navigate(['/trigger/create-prometheus-alert']);
  }
  cancel() {
    this.router.navigate(['/event']);
  }
}
