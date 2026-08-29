import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { company } from '../../Interfaces/taqim';

@Component({
  selector: 'app-chart-dialog-fliter-company',
  templateUrl: './chart-dialog-fliter-company.component.html',
  styleUrls: ['./chart-dialog-fliter-company.component.css']
})
export class ChartDialogFliterCompanyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChartDialogFliterCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { companies: company[], chartType: string }
  ) {}

  ngOnInit(): void {
    this.renderChart();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  renderChart(): void {
    const companies = this.data.companies;
    const labels = companies.map(c => `${c.assigDateMonth}/${c.assigDateYear}`);
    
    let datasets: any[] = [];

    if (this.data.chartType === 'combined') {
      datasets = [
        {
          label: 'عدد الطلبات المقبولة',
          data: companies.map(c => c.acceptedOrders),
          borderWidth: 3,
          borderColor: '#ff5733',
          backgroundColor: 'rgba(255, 87, 51, 0.4)',
          type: 'line',
          fill: false
        },
        {
          label: 'نسبة المقبول',
          data: companies.map(c => c.precentage),
          borderWidth: 3,
          borderColor: '#33ff57',
          backgroundColor: 'rgba(51, 255, 87, 0.4)',
          type: 'line',
          fill: false
        },
    
      ];
    }

    new Chart('dialogChartCanvas', {
      type: 'line', // أو 'line' حسب احتياجك
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'تاريخ',
              color: '#000',
              font: {
                size: 16, // زيادة حجم الخط
                weight: 'bold'
              }
            },
            ticks: {
              color: '#000',
              font: {
                size: 14 // زيادة حجم الخط
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'القيم',
              color: '#000',
              font: {
                size: 16, // زيادة حجم الخط
                weight: 'bold'
              }
            },
            ticks: {
              color: '#000',
              font: {
                size: 14 // زيادة حجم الخط
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#000',
              font: {
                size: 16 // زيادة حجم الخط
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                const label = context.dataset.label;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }
}
