import { Router } from '@angular/router';
import { OperationItem } from './../../type/operation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-operation-card',
  templateUrl: './operation-card.component.html',
  styleUrls: ['./operation-card.component.scss'],
})
export class OperationCardComponent implements OnInit {
  type?: string;
  @Input() item!: OperationItem;
  @Input() id!: number;
  @Output() deleteItem = new EventEmitter();
  name: string = 'http-server-operation';
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.type = 'HTTPServer';
  }
  delete() {
    this.deleteItem.emit();
  }
  edit() {
    if (this.item.type === 'HTTPServer') {
      this.router.navigate([`/operation/edit-httpServer`], {
        queryParams: { id: this.id },
      });
    } else if (this.item.type === 'Function') {
      this.router.navigate([`/operation/edit-function`], {
        queryParams: { id: this.id },
      });
    } else {
      this.router.navigate([`/operation/edit-scriptRunner`], {
        queryParams: { id: this.id },
      });
    }
  }
}
