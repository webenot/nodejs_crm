import { AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Filter, Order } from '../shared/interfaces';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.sass']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tooltip', {static: false}) tooltipRef: ElementRef;
  isFilterVisible: boolean = false;
  tooltip: MaterialInstance;

  limit = STEP;
  page = 1;

  oSub: Subscription;

  loading: boolean = false;
  reloading: boolean = false;
  noMoreOrders: boolean = false;

  filter = {};

  private ordersList: Order[] = [];

  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      limit: this.limit,
      page: this.page,
    });

    this.oSub = this.orderService.fetch(params).subscribe(
      (orders: Order[]) => {
        this.ordersList = this.ordersList.concat(orders);
        this.noMoreOrders = orders.length < this.limit;
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.loading = false;
        this.reloading = false;
      }
    );
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.tooltip(this.tooltipRef);
  }

  ngOnDestroy() {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  loadMore() {
    this.page++;
    this.loading = true;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.ordersList = [];
    this.page = 1;
    this.reloading = true;
    this.filter = filter;

    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length > 0;
  }

}
