import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {
  processes: any[] = [];
  filteredProcesses: any[] = [];
  displayedProcesses: any[] = [];
  isFiltered: boolean = false;

  cncOptions: { name: any, value: any }[] = [
    { name: 'OutSourceing', value: 'OSP' },
    { name: 'In House', value: 'Inhouse' },
  ];
  
  filterProcessId: any = '';
  filterProcessName: any = '';

  editingProcessId: number | null = null;
  isFetchError: boolean = false;

  @ViewChild('summaryTable') summaryTable!: ElementRef;

  constructor(private location: Location, private dataService: DataService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProcesses();
  }

  fetchProcesses() {
    this.dataService.getExcelprocess().subscribe(
      (data) => {
        this.processes = data;
        if (!this.isFiltered) {
          this.displayedProcesses = data;
        }
      },
      (error) => {
        console.error('Error fetching processes:', error);
        this.isFetchError = true;
      }
    );
  }

  submitForm() {
    this.filteredProcesses = this.processes.filter(process => {
      return (!this.filterProcessId || process.process_id.includes(this.filterProcessId)) &&
             (!this.filterProcessName || process.process_name.includes(this.filterProcessName)) 
    });
    this.displayedProcesses = this.filteredProcesses;
    this.isFiltered = true;
  }

  refreshData() {
    this.isFiltered = false;
    this.displayedProcesses = this.processes;
    this.clearForm();
  }

  clearForm() {
    this.filterProcessId = '';
    this.filterProcessName = '';
  }

  goBack(): void {
    this.location.back();
  }

  exportExcel(): void {
    const table = this.summaryTable.nativeElement;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table, { raw: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ProcessSummary');
    XLSX.writeFile(wb, 'ProcessSummary.xlsx');
  }

  exportPdf(): void {
    const table = this.summaryTable.nativeElement;
    html2canvas(table, { scale: 5 }).then((canvas) => {
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      doc.save('ProcessSummary.pdf');
    });
  }
}
