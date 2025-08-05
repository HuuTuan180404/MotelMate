import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DashboardInfoDTO {
  totalRevenue: number;
  totalBuilding: number;
  totalRooms: number;
  totalTenants: number;
  revenueByMonth: number[]; // doanh thu 4 tháng gần đây
  roomsByStatus: number[]; // [Available, Maintenance, Occupied]
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, CommonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isBrowser = false;

  barChartOptions?: ChartConfiguration<'bar'>['options'];
  barChartType: 'bar' = 'bar';
  barChartLabels: string[] = [];
  barChartData?: ChartData<'bar'>;

  pieChartOptions?: ChartConfiguration<'pie'>['options'];
  pieChartType: 'pie' = 'pie';
  pieChartLabels: string[] = ['Available', 'Maintainance', 'Occupied'];
  pieChartData?: ChartData<'pie', number[], string>;

  stats = {
    revenue: '$150,000',
    buildings: 8,
    rooms: 120,
    tenants: 90,
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.fetchDashboardData();
    }
  }

  // setupCharts() {
  //   const now = new Date();
  //   const monthLabels: string[] = [];

  //   for (let i = 4; i >= 1; i--) {
  //     const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
  //     const label = `${(date.getMonth() + 1)
  //       .toString()
  //       .padStart(2, '0')}/${date.getFullYear()}`;
  //     monthLabels.push(label);
  //   }

  //   this.barChartLabels = monthLabels;

  //   this.barChartOptions = {
  //     responsive: true,
  //     plugins: {
  //       legend: { display: false },
  //       title: { display: true, text: 'Revenue by Month' },
  //     },
  //   };

  //   // Dummy data
  //   const revenues = [120000, 95000, 130000, 110000];

  //   this.barChartData = {
  //     labels: this.barChartLabels,
  //     datasets: [
  //       {
  //         data: revenues,
  //         label: 'Revenue ($)',
  //         backgroundColor: [
  //           '#45a9ea',
  //           '#ff9800',
  //           '#4caf50',
  //           '#f44336',
  //         ],
  //       },
  //     ],
  //   };

  //   this.pieChartOptions = {
  //     responsive: true,
  //     plugins: {
  //       legend: { position: 'top' },
  //       title: { display: true, text: 'Room Status' },
  //     },
  //   };

  //   this.pieChartData = {
  //     labels: this.pieChartLabels,
  //     datasets: [
  //       {
  //         data: [60, 25, 15],
  //         backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
  //       },
  //     ],
  //   };
  // }
  fetchDashboardData() {
    this.http
      .get<DashboardInfoDTO>(`${environment.apiUrl}/api/Dashboard`)
      .subscribe({
        next: (data) => {
          this.stats = {
            revenue: `${data.totalRevenue.toLocaleString()}VND`,
            buildings: data.totalBuilding,
            rooms: data.totalRooms,
            tenants: data.totalTenants,
          };

          const now = new Date();
          const monthLabels: string[] = [];
          for (let i = 4; i >= 1; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${date.getFullYear()}`;
            monthLabels.push(label);
          }

          this.barChartOptions = {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Revenue by Month' },
            },
          };

          this.barChartLabels = monthLabels;
          this.barChartData = {
            labels: this.barChartLabels,
            datasets: [
              {
                data: data.revenueByMonth,
                label: 'Revenue (VND)',
                backgroundColor: ['#45a9ea', '#ff9800', '#4caf50', '#f44336'],
              },
            ],
          };

          this.pieChartOptions = {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Room Status' },
            },
          };
          this.pieChartData = {
            labels: this.pieChartLabels,
            datasets: [
              {
                data: data.roomsByStatus,
                backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
              },
            ],
          };
        },
        error: (err) => {
          console.error('Failed to load dashboard data', err);
        },
      });
  }
}
