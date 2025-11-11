import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from 'src/app/demo/service/data.service';
import { SelectItem } from 'primeng/api';
import * as XLSX from 'xlsx';

@Component({
  templateUrl: './sumplanned.component.html'
})
export class SumplannedComponent implements OnInit {
  process: any[] = [];
  filteredProcess: any[] = [];
  searchTerm: string = '';
  showDialog: boolean = false;
  row: any;

  popupOptions: SelectItem[] = [
    { label: 'CNC 001', value: 'CNC 001' },
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' },
    { label: 'Welding Auto', value: 'Welding Auto' },
    { label: 'Welding Manual', value: 'Welding Manual' },
    { label: 'Test Station 1', value: 'Test Station 1' },
    { label: 'Test Station 2', value: 'Test Station 2' },
    { label: 'Test Station 3', value: 'Test Station 3' },
  ];

  constructor(private location: Location, private dataService: DataService) { }

  ngOnInit() {
    this.summary();
  }
  refresh(){
    this.summary();

  }

  mergeData(data: any[]): any[] {
    const mergedData = [];
    const rowIndexMap = new Map();
  
    data.forEach(item => {
      const key = `${item.date_time}_${item.machine_no}_${item.location}_${item.reported_by}_${item.breakdown_desc}_${item.root_cause}_${item.actions_taken}_${item.total_cost}_${item.downtime_duration}_${item.maintenance_personnel}_${item.followup_required}_${item.comments}`;
      
      if (rowIndexMap.has(key)) {
        const index = rowIndexMap.get(key);
        mergedData[index].spares.push(item.spares);
        mergedData[index].spares_cost.push(item.spares_cost);
      } else {
        rowIndexMap.set(key, mergedData.length);
        mergedData.push({
          ...item,
          spares: [item.spares],
          spares_cost: [item.spares_cost],
          rowspan: 1
        });
      }
    });
  
    // Calculate rowspan
    mergedData.forEach(item => {
      item.rowspan = item.spares.length;
    });
  
    return mergedData;
  }

  summary() {
    this.dataService.getbreaksum().subscribe(
      (data: any[]) => {
        this.process = data;
        this.filteredProcess = this.mergeData(this.process); // Merge data
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  filterData() {
    if (this.searchTerm.trim()) {
      this.filteredProcess = this.process.filter(item =>
        item.machine_no.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    } else {
      this.filteredProcess = [...this.process]; // Show all data when searchTerm is empty
    }
  }
  
  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.convertDataToSheetArray());
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'maintenanceplanned');
  }
  

  convertDataToSheetArray(): any[][] {
    const sheetData = [];
    
    this.filteredProcess.forEach(item => {
      // Add main row for each item
      const mainRow = [
        item.date_time,
        item.machine_no,
        item.location,
        item.reported_by,
        item.breakdown_desc,
        item.root_cause,
        item.actions_taken,
        '', // Placeholder for first spare part used
        '', // Placeholder for first spare part cost
        item.total_cost,
        item.downtime_duration,
        item.maintenance_personnel,
        item.followup_required,
        item.comments
      ];
  
      // Push main row to sheet data
      sheetData.push(mainRow);
  
      // Add additional rows for each spare part used and its cost
      for (let i = 0; i < item.spares.length; i++) {
        if (i === 0) {
          // Use the main row for the first spare part used and its cost
          mainRow[7] = item.spares[i]; // Individual spare part used
          mainRow[8] = item.spares_cost[i]; // Corresponding cost
        } else {
          // For subsequent spare parts, create new rows
          const spareRow = [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            item.spares[i], // Individual spare part used
            item.spares_cost[i], // Corresponding cost
            '',
            '',
            '',
            '',
            ''
          ];
  
          // Push spare row to sheet data
          sheetData.push(spareRow);
        }
      }
    });
  
    const headerRow = [
      'Date & Time',
      'Machine Name',
      'Location',
      'Reported By',
      'Breakdown Description',
      'Root Cause',
      'Actions Taken',
      'Spare Parts Used',
      'Spare Parts Cost',
      'Total Cost of Repair',
      'Downtime Duration',
      'Maintenance Personnel',
      'Follow-up Required',
      'Comments'
    ];
  
    // Insert header row at the beginning of the sheetData array
    sheetData.unshift(headerRow);
  
    return sheetData;
  }
  
  

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const today = new Date();
    const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const fileNameToSave = `${fileName}_${dateString}.xlsx`;

    if ((navigator as any).msSaveOrOpenBlob) {
      // For IE, Edge (Browsers that support MS Save OR Open Blob)
      (navigator as any).msSaveOrOpenBlob(data, fileNameToSave);
    } else {
      // For other browsers
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = fileNameToSave;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }

  selectOption(option: any, row: any) {
    this.searchTerm = option.label; // Assign selected machine name to searchTerm
    this.filteredProcess = this.process.filter(item =>
      item.machine_no.toLowerCase() === option.value.toLowerCase()
    );
    this.showDialog = false; // Hide the dialog
  }

  openDialog(row: any) {
    this.showDialog = true; // Show the dialog
  }
}
