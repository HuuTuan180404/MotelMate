import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  isBrowser = false;

  barChartOptions?: ChartConfiguration<'bar'>['options'];
  barChartType: 'bar' = 'bar';
  barChartLabels: string[] = ['USA', 'UK', 'France', 'Germany'];
  barChartData?: ChartData<'bar'>;

  pieChartOptions?: ChartConfiguration<'pie'>['options'];
  pieChartType: 'pie' = 'pie';
  pieChartLabels: string[] = ['Chrome', 'Safari', 'Firefox', 'Other'];
  pieChartData?: ChartData<'pie', number[], string>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.setupCharts();
    }
  }

  setupCharts() {
    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Population by Country' }
      }
    };
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          data: [50000000, 30000000, 20000000, 15000000],
          label: 'Population',
          backgroundColor: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
        }
      ]
    };

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Browser Market Share' }
      }
    };
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: [60, 25, 10, 5],
          backgroundColor: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
        }
      ]
    };
  }
}
