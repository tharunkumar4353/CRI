import { Component } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment-timezone'; // Import moment-timezone

export interface SparePart {
  sparePartsUsed: string;
  sparePartsCost: any;
}

export interface MaintenanceRecord {
  dateTime: string; // Changed to string (ISO format)
  machineIdName: string;
  location: string;
  reportedBy: string;
  breakdownDescription: string;
  rootCause: string;
  actionsTaken: string;
  spareParts: SparePart[];
  downtimeDuration: string;
  maintenancePersonnel: string;
  followUpRequired: string;
  comments: string;
  totalCostOfRepair: number;
}

@Component({
  selector: 'app-planned-demo',
  templateUrl: './planneddemo.component.html',
})
export class PlannedDemoComponent {
  visible: boolean = false;
  selectedRowIndex: number | null = null;
  spareParts: SparePart[] = [];

  rows: MaintenanceRecord[] = [{
    dateTime: moment().format('YYYY-MM-DD'), // Use moment to create ISO string
    machineIdName: '',
    location: '',
    reportedBy: '',
    breakdownDescription: '',
    rootCause: '',
    actionsTaken: '',
    spareParts: [{ sparePartsUsed: '', sparePartsCost: ''}],
    downtimeDuration: '',
    maintenancePersonnel: '',
    followUpRequired: '',
    comments: '',
    totalCostOfRepair: 0
  }];

  constructor(private dataService: DataService) {}

  addRow() {
    this.rows.push({
      dateTime: moment().format('YYYY-MM-DD'), // Use moment to create ISO string
      machineIdName: '',
      location: '',
      reportedBy: '',
      breakdownDescription: '',
      rootCause: '',
      actionsTaken: '',
      spareParts: [{ sparePartsUsed: '', sparePartsCost: ''}],
      downtimeDuration: '',
      maintenancePersonnel: '',
      followUpRequired: '',
      comments: '',
      totalCostOfRepair: 0
    });
  }

  addSpareRow() {
    this.spareParts.push({ sparePartsUsed: '', sparePartsCost: ''});
  }

  openSparesDialog(index: number) {
    this.selectedRowIndex = index;
    this.spareParts = [...this.rows[index].spareParts];
    this.visible = true;
  }

  saveSpareParts() {
    if (this.selectedRowIndex !== null) {
      this.rows[this.selectedRowIndex].spareParts = [...this.spareParts];
  
      let totalCost = 0;
      this.spareParts.forEach(sparePart => {
        let cost = parseFloat(sparePart.sparePartsCost);
        if (!isNaN(cost)) {
          totalCost += cost;
        }
      });
  
      this.rows[this.selectedRowIndex].totalCostOfRepair = totalCost;
    }
    this.visible = false;
  }

  submit() {
    // Validate that all rows have required fields filled
    const allFieldsFilled = this.rows.every(row =>
      row.dateTime && 
      row.machineIdName && 
      row.location && 
      row.reportedBy && 
      row.breakdownDescription && 
      row.rootCause && 
      row.actionsTaken && 
      row.spareParts && 
      row.downtimeDuration && 
      row.maintenancePersonnel && 
      row.followUpRequired && 
      row.comments && 
      row.totalCostOfRepair
    );
  
    if (!allFieldsFilled) {
      alert('Please fill in all required fields in the records before submitting.');
      return; // Stop the submission process
    }
  
    // Confirm with the user before proceeding
    const confirmed = window.confirm('Are you sure you want to submit all records?');
  
    if (confirmed) {
      // Proceed with the submission if confirmed
      this.rows.forEach(row => {
        // Convert the date to a string in the correct format with time zone
        let dataToSubmit: MaintenanceRecord = {
          dateTime: moment.tz(row.dateTime, 'YYYY-MM-DD', 'Asia/Kolkata').format(), // Use 'Asia/Kolkata' for IST
          machineIdName: row.machineIdName,
          location: row.location,
          reportedBy: row.reportedBy,
          breakdownDescription: row.breakdownDescription,
          rootCause: row.rootCause,
          actionsTaken: row.actionsTaken,
          spareParts: row.spareParts,
          downtimeDuration: row.downtimeDuration,
          maintenancePersonnel: row.maintenancePersonnel,
          followUpRequired: row.followUpRequired,
          comments: row.comments,
          totalCostOfRepair: row.totalCostOfRepair
        };
  
        this.dataService.insertbreakmain(dataToSubmit).subscribe({
          next: response => {
            console.log('Record inserted successfully', response);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error inserting record', error);
            console.error('Error details:', error.error);
          }
        });
      });
  
      this.clearForm();
    } else {
      console.log('Submission cancelled.');
    }
  }
  

  clearForm() {
    this.rows = [{
      dateTime: moment().format('YYYY-MM-DD'), // Use moment to create ISO string
      machineIdName: '',
      location: '',
      reportedBy: '',
      breakdownDescription: '',
      rootCause: '',
      actionsTaken: '',
      spareParts: [{ sparePartsUsed: '', sparePartsCost: ''}],
      downtimeDuration: '',
      maintenancePersonnel: '',
      followUpRequired: '',
      comments: '',
      totalCostOfRepair: 0
    }];
  }

  popupOptions: SelectItem[] = [
    // { label: 'CNC 001', value: 'CNC 001' },
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' },

  ];

  selectOption(option: SelectItem, row: any) {
    row.machineIdName = option.label; // Assign selected machine name
    row.showDialog = false; // Hide the dialog
  }
  
  showDialog(row: any) {
    row.showDialog = true; // Show the dialog
  }
}
