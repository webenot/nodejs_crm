import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.sass'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal', {static: false}) modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;
  pending = false;
  oSub: Subscription;
  orderService: OrderService;

  constructor(private router: Router,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.isRoot = this.router.url === '/order';
        }
      }
    );
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onCancelModal() {
    this.modal.close();
  }

  openModal() {
    this.modal.open();
  }

  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  onSubmit() {
    this.pending = true;

    const newOrder: Order = {
      list: this.orderService.list.map(p => {
        delete p._id;
        return p;
      }),
    };

    this.oSub = this.ordersService.create(newOrder).subscribe(
      (order: Order) => {
        MaterialService.toast(`Заказ № ${order.order} был добавлен`);
        this.orderService.clear();
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

  removePosition(orderPosition: OrderPosition) {
    this.orderService.delete(orderPosition);
  }

}
