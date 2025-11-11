import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx'; // If you are using Excel functionality
import * as jsPDF from 'jspdf'; // Import jsPDF library
import 'jspdf-autotable';

interface Type {
  name: string;
  code: string;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  templateUrl: './part.component.html',
})
export class PartComponent implements OnInit {
  visible: boolean = false;
  sum: any[] = []; // Placeholder for summary table data
  @ViewChild('summaryTable', { static: false }) summaryTable: ElementRef | undefined; // ViewChild for accessing HTML table element
  originalSum: any[];
  
  summary() {
      this.visible = true;
  }

  itemOption: any[] = [];
  filteredItemOption: any[] = [];
  searchText: string = '';
  nameOption: any[] = [];
  typeOption: any[] = [];
  itemsOption: any[] = [];
  processOption: any[] = [];
  filteredProcessOption: any[] = [];
  searchProcessText: string = '';
  value6: any = '';
  value4: any = '';
  value3: any = '';
  selectItem: { name: string };
  selectedItem: { name: string };
  selectType: { name: string };
  selectPartid: { name: string };
  selectPartname: { name: string }; 
  row: any = {};
  showDialog: boolean = false;
  value8: any = '';
  messageService: any;
  partEntries: any[] = [];
  editingPartId: number | null = null;
  customerOptions: any[] = [];
  value2: any = '';
  value5: any = '';
  value7: any = '';
  type: Type[] | undefined;
  selectedType: Type | undefined;
  showProcessDialog: boolean = false;

  constructor(private location: Location, private dataService: DataService, private http: HttpClient) {}

  onUpload1(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  onUpload2(event: UploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }


  submitForm() {
    const filteredSum = this.originalSum.filter(item => {
      const partIdMatch = this.value3 ? item.part_id.includes(this.value3) : true;
      const partNameMatch = this.value2 ? item.part_name.includes(this.value2) : true;
      return partIdMatch && partNameMatch;
    });

    // Update the summary table with filtered data
    this.sum = filteredSum;
    
  this.clearForm()

    // Optionally, you can log the filtered data to the console for debugging
    console.log('Filtered Summary:', this.sum);
  }

 

  clearForm() {
    this.value2 = '';
    this.value3 = '';

  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {




    this.dataService.getExcelpart().subscribe(
      (data: any[]) => {
        this.sum = data;
        this.originalSum = data; // Store the original data
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

  }



  openDialog() {
    this.showDialog = true;
  }
 
  closeDialog() {
    this.showDialog = false;
  }

  openProcessDialog() {
    this.showProcessDialog = true;
}

closeProcessDialog() {
    this.showProcessDialog = false;
}
getData(): void {
  this.dataService.getExcelpart().subscribe(
    (data: any[]) => {
      this.sum = data;
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
refreshData(): void {
  this.getData();
}



   // Method to export summary table to Excel
   exportExcel(): void {
    if (this.summaryTable) {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.summaryTable.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Summary_Table');
        XLSX.writeFile(wb, 'summary_table.xlsx');
    }
}
exportPdf() {

}
}