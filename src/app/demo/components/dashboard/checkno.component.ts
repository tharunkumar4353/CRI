import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'checkno-component',
  templateUrl: './checkno.component.html'
})
export class ChecknoComponent implements OnInit {
  currentDate: Date = new Date();
  process: any[] = [];
  filteredProcess: any[] = [];
  paginatedProcess: any[] = []; // For storing current page data
  dateFrom: Date;
  dateTo: Date;
  selectedMachine: string | null = null;
  first: number = 0; // Current page index
  rows: number = 15; // Rows per page

  machines: any[] = [
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' },
  ];

  constructor(
    private location: Location,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.fetchSummaryData();
  }

  fetchSummaryData(): void {
    this.dataService.getSummaryqualityData().subscribe(
      data => {
        this.process = data;
        this.filteredProcess = [...this.process];
        this.updatePaginatedProcess();
        this.process.forEach(item => item.isEditing = false); // Initialize editing state
      },
      error => {
        console.error('Error fetching summary data', error);
      }
    );
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedProcess(); // Update paginated data on page change
  }

  // Helper method to update the paginated process list
  updatePaginatedProcess(): void {
    this.paginatedProcess = this.filteredProcess.slice(this.first, this.first + this.rows);
  }

  onSubmit() {
    if (this.dateFrom && this.dateTo && this.selectedMachine) {
      const fromDate = new Date(this.dateFrom);
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59, 999);
      this.filteredProcess = this.process.filter(item => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= fromDate &&
          itemDate <= toDate &&
          item.machine_name === this.selectedMachine
        );
      });
      this.updatePaginatedProcess();
    }
  }

  enableEditing(part: any) {
    part.isEditing = true;
  }

  saveChanges(part: any) {
    this.dataService.updatePartData(part).subscribe(
      response => {
        console.log('Data updated successfully');
        part.isEditing = false; // Exit editing mode after successful update

        // Show an alert message on successful update
        window.alert('Data updated successfully');
      },
      error => {
        console.error('Error updating data', error);
      }
    );
  }

  deleteRow(index: number) {
    // Show a confirmation dialog before deleting
    const confirmed = window.confirm('Are you sure you want to delete this data?');

    if (confirmed) {
      const part = this.filteredProcess[index];
      this.dataService.deletePartData(part.id).subscribe(
        response => {
          console.log('Data deleted successfully');
          this.filteredProcess.splice(index, 1); // Remove the part from the UI after successful deletion
          this.updatePaginatedProcess();

          // Show an alert message on successful deletion
          window.alert('Data deleted successfully');
        },
        error => {
          console.error('Error deleting data', error);
        }
      );
    }
  }

  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredProcess);
    const workbook: XLSX.WorkBook = { Sheets: { 'Summary Table': worksheet }, SheetNames: ['Summary Table'] };
    XLSX.writeFile(workbook, 'SummaryTable.xlsx');
  }

  exportPdf(): void {
    const data = document.getElementById('summary-table');
    if (data) {
      html2canvas(data, {
        scale: 5,
        logging: true,
        windowWidth: data.clientWidth * 2,
        windowHeight: data.clientHeight * 2,
      }).then(canvas => {
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const doc = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('SummaryTable.pdf');
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}