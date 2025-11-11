import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import html2canvas from 'html2canvas'; // Import html2canvas for PDF export
import jsPDF from 'jspdf'; // Import jsPDF for PDF export
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit {
  employeeData: any[] = [];
  filteredEmployeeData: any[] = []; // Filtered data array
  filterEmployeeId: string = '';
  filterEmployeeName: string = '';

  constructor(private location: Location, private dataService: DataService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmployeeData();
  }

  fetchEmployeeData() {
    this.dataService.getExcelemp().subscribe(
      (data) => {
        this.employeeData = data;
        this.filteredEmployeeData = data; // Initialize filtered data
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  submitForm() {
    this.filteredEmployeeData = this.employeeData.filter(employee => {
      return (!this.filterEmployeeId || employee.emp_id.includes(this.filterEmployeeId)) &&
             (!this.filterEmployeeName || employee.emp_name.includes(this.filterEmployeeName));
    });
    this.clearForm();
  }

  refreshData() {
    this.fetchEmployeeData();
  }

  clearForm() {
    this.filterEmployeeId = '';
    this.filterEmployeeName = '';
  }

  goBack(): void {
    this.location.back();
  }

  // Export summary table to Excel

exportExcel(): void {
  const tableElement = document.getElementById('summary-table');
  if (tableElement) {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SummaryTable');
  XLSX.writeFile(wb, 'SummaryTable.xlsx');
  } else {
  console.error('Table element not found');
  }
  }
  
  // Export summary table to PDF
  exportPdf(): void {
  const data = document.getElementById('summary-table');
  if (data) {
  html2canvas(data, {
  scale: 5, // Adjust scale for better resolution
  logging: true,
  scrollY: 0,
  }).then(canvas => {
  const imgWidth = 210; // A4 page width in mm
  const imgHeight = canvas.height * imgWidth / canvas.width;
  const doc = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  doc.save('SummaryTable.pdf');
  });
  } else {
  console.error('Table element not found');
  }
  }
}
