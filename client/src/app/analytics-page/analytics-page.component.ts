import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.sass']
})
export class AnalyticsPageComponent implements OnDestroy, AfterViewInit {

  @ViewChild('gain', {static: false}) gainRef: ElementRef;
  @ViewChild('order', {static: false}) orderRef: ElementRef;

  average: number;
  pending: boolean = true;

  analytics: AnalyticsPage;

  aSub: Subscription;

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: '#36a2eb'
    };

    this.aSub = this.service.getAnalytics().subscribe(
      (analytics: AnalyticsPage) => {
        this.analytics = analytics;
        this.average = analytics.average;
        gainConfig.labels = analytics.chart.map(item => item.label);
        gainConfig.data = analytics.chart.map(item => item.gain);

        const gainContext = this.gainRef.nativeElement.getContext('2d');
        gainContext.canvas.height = '300px';

        new Chart(gainContext, createChartConfig(gainConfig));

        orderConfig.labels = gainConfig.labels;
        orderConfig.data = analytics.chart.map(item => item.order);

        const orderContext = this.orderRef.nativeElement.getContext('2d');
        orderContext.canvas.height = '300px';

        new Chart(orderContext, createChartConfig(orderConfig));
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.pending = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false,
        }
      ]
    }
  };
}
