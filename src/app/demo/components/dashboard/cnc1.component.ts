import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'cnc1-component',
  templateUrl: './cnc1.component.html',
})
export class Cnc1Component implements OnInit {

  data: any;
  options: any;

  data1: any;
  options1: any;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  selectedMachine: string | null = null;
  machines: any[] = [
    // { label: 'CNC-01', value: 'CNC-01' },
    { label: 'CNC-02', value: 'CNC-02' },
    { label: 'CNC-03', value: 'CNC-03' },
    { label: 'CNC-04', value: 'CNC-04' },
    { label: 'CNC-05', value: 'CNC-05' },
    { label: 'VMC-01', value: 'VMC-01' },
    { label: 'VMC-02', value: 'VMC-02' },
  ];
data2: any;
options2: any;

  constructor(private dataService: DataService,    private location: Location  ) {}

  ngOnInit() {
    this.initializeChartOptions();
    this.initializeChartOptions1();

  }

  initializeChartOptions1() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
    this.options2 = {
      maintainAspectRatio: false,
      aspectRatio: 1.0,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: false, // Disable stacking
          title: {
            display: true,
            text: 'Date',
            color: textColor,
            font: {
              size: 14
            }
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: false, // Disable stacking
          title: {
            display: true,
            text: 'Part Count',
            color: textColor,
            font: {
              size: 14
            }
          },
          ticks: {
            color: textColorSecondary,
            callback: function(value) {
              return `${value} `; // Change 'min' to appropriate unit
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  
  initializeChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
    this.options1 = {
      maintainAspectRatio: false,
      aspectRatio: 1.0,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Date',
            color: textColor,
            font: {
              size: 14
            }
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Minutes',
            color: textColor,
            font: {
              size: 14
            }
          },
          ticks: {
            color: textColorSecondary,
            callback: function(value) {
              return `${value} `;
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  

  fetchMachineData() {
    if (!this.selectedMachine || !this.dateFrom || !this.dateTo) {
      return;
    }

    this.dataService.getMachineData(this.selectedMachine, this.dateFrom, this.dateTo).subscribe(data => {
      this.mapDataToChart(data);
    });
  }

  fetchMachineData1() {
    if (!this.selectedMachine || !this.dateFrom || !this.dateTo) {
      return;
    }

    this.dataService.getpartgraphdata(this.selectedMachine, this.dateFrom, this.dateTo).subscribe(data => {
      this.mapDataToChart1(data);
    });
  }


  mapDataToChart(data) {
    const labels = this.generateDateLabels();
    const datasets = this.generateDatasets(data);

    this.data1 = {
      labels: labels,
      datasets: datasets
    };
  }

  mapDataToChart1(data) {
    const labels = this.generateDateLabels1();
    const datasets = this.generateDatasets1(data);

    this.data2 = {
      labels: labels,
      datasets: datasets
    };
  }

  
  generateDateLabels(): string[] {
    const labels = [];
    const startDate = new Date(this.dateFrom);
    const endDate = new Date(this.dateTo);
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      labels.push(formatDate(date, 'dd-MM-yyyy', 'en'));
    }
    return labels;
  }

  generateDateLabels1(): string[] {
    const labels = [];
    const startDate = new Date(this.dateFrom);
    const endDate = new Date(this.dateTo);
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      labels.push(formatDate(date, 'dd-MM-yyyy', 'en'));
    }
    return labels;
  }

  generateDatasets(data: any[]): any[] {
    const categories = ['run_time', 'process_idle', 'machine_idle', 'breakdown'];
    const datasets = [];

    categories.forEach(category => {
      const categoryData = this.generateCategoryData(data, category);
      datasets.push({
        label: category.replace('_', ' ').toUpperCase(),
        data: categoryData,
        backgroundColor: this.getColorForCategory(category),
        stack: 'Stack 0'
      });
    });

    return datasets;
  }

  generateDatasets1(data: any[]): any[] {
    const categories = ['actual_partcount', 'planned_partcount'];
    const datasets = [];
  
    categories.forEach(category => {
      const categoryData = this.generateCategoryData1(data, category);
      datasets.push({
        label: category.replace('_', ' ').toUpperCase(),
        data: categoryData,
        backgroundColor: this.getColorForCategory1(category),
        // For regular bar chart, you don't need the `stack` property
      });
    });
  
    return datasets;
  }
  

  generateCategoryData(data: any[], key: string): number[] {
    const categoryData = [];
    const startDate = new Date(this.dateFrom);
    const endDate = new Date(this.dateTo);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const filteredData = data.filter(item => formatDate(new Date(item.date), 'yyyy-MM-dd', 'en') === formatDate(date, 'yyyy-MM-dd', 'en'));
      const lastEntry = filteredData.length > 0 ? filteredData[filteredData.length - 1][key] : 0;
      categoryData.push(lastEntry);
    }

    return categoryData;
  }
  generateCategoryData1(data: any[], key: string): number[] {
    const categoryData = [];
    const startDate = new Date(this.dateFrom);
    const endDate = new Date(this.dateTo);
  
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const filteredData = data.filter(item => formatDate(new Date(item.date), 'yyyy-MM-dd', 'en') === formatDate(date, 'yyyy-MM-dd', 'en'));
      const lastEntry = filteredData.length > 0 ? filteredData[filteredData.length - 1][key] : 0;
      categoryData.push(lastEntry);
    }
  
    return categoryData;
  }
  

  getColorForCategory(category: string): string {
    switch (category) {
      case 'run_time':
        return getComputedStyle(document.documentElement).getPropertyValue('--green-500');
      case 'process_idle':
        return getComputedStyle(document.documentElement).getPropertyValue('--orange-500');
      case 'machine_idle':
        return getComputedStyle(document.documentElement).getPropertyValue('--blue-500');
      case 'breakdown':
        return getComputedStyle(document.documentElement).getPropertyValue('--red-500');
      default:
        return getComputedStyle(document.documentElement).getPropertyValue('--gray-500');
    }
  }

  getColorForCategory1(category: string): string {
    switch (category) {
      case 'actual_partcount':
        return getComputedStyle(document.documentElement).getPropertyValue('--green-500');
      case 'planned_partcount':
        return getComputedStyle(document.documentElement).getPropertyValue('--orange-500');
      default:
        return getComputedStyle(document.documentElement).getPropertyValue('--gray-500');
    }
  }

  onSubmit() {
    this.fetchMachineData();
  }

  onSubmit1() {
    this.fetchMachineData1();
  }

  goBack(): void {
    this.location.back();
  }


  showTodayGraph() {
    const today = new Date();
    this.dateFrom = today;
    this.dateTo = today;
    this.fetchMachineData();
  }

  showTodayGraph1() {
    const today = new Date();
    this.dateFrom = today;
    this.dateTo = today;
    this.fetchMachineData1();
  }

  refreshGraph() {
    this.fetchMachineData();
  }
  refreshGraph1() {
    this.fetchMachineData1();
  }
}
