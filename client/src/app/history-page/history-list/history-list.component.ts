import { AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild } from '@angular/core';

import { Order } from '../../shared/interfaces';
import { MaterialInstance, MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass']
})
export class HistoryListComponent implements AfterViewInit, OnDestroy {

  @Input() orders: Order[];

  @ViewChild('modal', {static: false}) modalRef: ElementRef;
  modal: MaterialInstance;
  selectedOrder: Order;

  constructor() { }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return item.cost * item.quantity + total;
    }, 0);
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  closeModal() {
    this.modal.close();
  }

}
