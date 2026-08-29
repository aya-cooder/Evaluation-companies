import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { company } from '../../Interfaces/taqim';

@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.css']
})
export class ChartDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChartDialogComponent>,
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
    
    const acceptedPercentages = companies.map(c => c.acceptedPercentage);
    const totalAcceptedNumbers = companies.map(c => c.totalAcceptedNumber);

    const acceptedColors = acceptedPercentages.map(percentage =>
      percentage < 85 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)'
    );

    const chartData = this.data.chartType === 'acceptedPercentage' ? acceptedPercentages : totalAcceptedNumbers;
    const chartLabel = this.data.chartType === 'acceptedPercentage' ? 'Accepted Percentage' : 'Total Accepted Number';
    const yAxisLabel = this.data.chartType === 'acceptedPercentage' ? 'Percentage' : 'Total Number';

    new Chart('dialogChartCanvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: chartLabel,
            data: chartData,
            backgroundColor: acceptedColors,
            borderColor: acceptedColors.map(color => color.replace('0.2', '1')),
            borderWidth: 1
          },
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
              generateLabels: (chart) => {
                return [
                  {
                    text: 'Below 85%',
                    fillStyle: 'rgba(255, 99, 132, 1)',
                    strokeStyle: 'rgba(255, 99, 132, 1)',
                    lineWidth: 1,
                  },
                  {
                    text: 'Above 85%',
                    fillStyle: 'rgba(75, 192, 192, 1)',
                    strokeStyle: 'rgba(75, 192, 192, 1)',
                    lineWidth: 1,
                  },
                ];
              },
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
                if (label === 'Accepted Percentage') {
                  return `${label}: ${value}%`;
                } else {
                  return `${label}: ${value}`;
                }
              }
            }
          }
        }
      }
    });
  }
}
