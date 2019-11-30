import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { Filter } from '../../shared/interfaces';
import { MaterialDatepicker, MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.sass']
})
export class HistoryFilterComponent implements AfterViewInit, OnDestroy {

  @Output() onFilter = new EventEmitter<Filter>();
  order: number;

  @ViewChild('start', {static: false}) startRef: ElementRef;
  @ViewChild('end', {static: false}) endRef: ElementRef;

  startDatepicker: MaterialDatepicker;
  endDatepicker: MaterialDatepicker;

  isValid: boolean = false;

  constructor() { }

  ngAfterViewInit() {
    this.startDatepicker = MaterialService.datepicker(this.startRef, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose: this.validate.bind(this),
      autoClose: true,
    });
    this.endDatepicker = MaterialService.datepicker(this.endRef, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose: this.validate.bind(this),
      autoClose: true,
    });
  }

  ngOnDestroy() {
    this.startDatepicker.destroy();
    this.endDatepicker.destroy();
  }

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.startDatepicker.date) {
      filter.start = this.startDatepicker.date;
    }

    if (this.endDatepicker.date) {
      filter.end = this.endDatepicker.date;
    }

    this.onFilter.emit(filter);
  }

  validate() {

    if (!this.startDatepicker.date || !this.endDatepicker.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.startDatepicker.date <= this.endDatepicker.date;
  }

}
