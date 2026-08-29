import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { company } from '../../Interfaces/taqim';

@Component({
  selector: 'app-chart-dialog-notupload',
  templateUrl: './chart-dialog-notupload.component.html',
  styleUrls: ['./chart-dialog-notupload.component.css']
})
export class ChartDialogNOTuploadComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChartDialogNOTuploadComponent>,
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
    const labels = companies.map(c => c.companyName);

    let chartData: number[];
    let chartLabel: string;
    let yAxisLabel: string;
    let backgroundColors: string[];

    if (this.data.chartType === 'acceptedPercentage') {
      chartData = companies.map(c => c.acceptedPercentage);
      chartLabel = 'نسبة لم يتم الرفع ';
      yAxisLabel = 'Percentage (%)';
      backgroundColors = chartData.map(value => value > 3 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)');
    } else {
      chartData = companies.map(c => c.totalAcceptedNumber);
      chartLabel = 'عدد الطلبات التي لم يتم رفعها   ';
      yAxisLabel = 'Total Number';
      backgroundColors = new Array(chartData.length).fill('rgba(75, 192, 192, 0.2)');
    }

    new Chart('dialogChartCanvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: chartLabel,
            data: chartData,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Company Name',
              color: '#000',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              color: '#000',
              font: {
                size: 12
              }
            }
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel,
              color: '#000',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              color: '#000',
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#000',
              font: {
                size: 14
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
