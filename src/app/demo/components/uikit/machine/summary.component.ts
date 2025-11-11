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

interface Processtype {
  name: string;
  code: string;
}


@Component({
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {
  showworkorder: boolean;
  filteredworkorderOptions: { name: string; }[];
  workorderOption: { name: string; }[];
  searchworkorderpart: any;
  showEmpDialog1: boolean;
  filteredEmpOptionsop: any;
  empOptionop: { name: string; }[];
  searchEmpop: any;
  showEmpDialog: boolean = false;
  showItemDialog: boolean;
  searchTerm: string = '';
  filteredOptions: any[] = [];

  searchEmp: string = '';  // Define necessary properties
  empOption: { name: string }[];  // Assuming empOption is an array of employee objects
  filteredEmpOptions: { name: string }[];
  processtype: Processtype[] | undefined;
  selectedProcesstype: Processtype | undefined;
  first: number = 0;
  rows: number = 15;
  currentItem: any;
  showcustcode: boolean;
  custcodeOption: { name: string; }[];
  filteredcustcodeOptions: { name: string; }[];
  filteredfgnameOptions: { name: string; }[];
  fgnameOption: { name: string; }[];
  showfgname: boolean;
  searchfgname: any;
  searchcustcode: any;
  process: any[] = [];
  filteredProcess: any[] = [];
  paginatedProcess: any[] = [];
  dateFrom: any;
  dateTo: any;
  selectedMachine: string = '';
  selectedItem: any;
  displayDialog: boolean = false;
  selectedMachineEdit: string | null = null;
  machines: any[] = [
    { label: 'CNC 001', value: 'CNC 001' },
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' }
  ];
  optionItem: any;
  itemOption: { name: string; }[];

  constructor(
    private location: Location,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getmachineshow().subscribe(
      (data: any[]) => {
        this.process = data.map(item => ({
          ...item,
          isEditing: false,

        }));
        this.filteredProcess = this.process;
        this.updatePaginatedProcess();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    this.processtype = [
      { name: 'Production', code: 'P1' },
      { name: 'Setting', code: 'P2' },

    ];

    // emp name call
    this.dataService.getEmpitemNames().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.empOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredEmpOptions = this.empOption;
    });
    

    this.dataService.getEmpitemNamesop().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.empOptionop = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredEmpOptionsop = this.empOptionop;
    });
    

    //partid 
    this.dataService.getPartitemNames().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.itemOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredOptions = this.itemOption;
    });
    

    // fg name call
    this.dataService.getPartdataexcel1().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.fgnameOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredfgnameOptions = this.fgnameOption;
    });
    

    // cust name call
    this.dataService.getPartdataexcel().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.custcodeOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredcustcodeOptions = this.custcodeOption;
    });
    

    // workorder call
    this.dataService.getPartdataexcelwork().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.workorderOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredworkorderOptions = this.workorderOption;
    });
    
  }
  showEmployeeDialog1(item: any): void {
    this.currentItem = item;
    this.showEmpDialog1 = true;
  }

  hideEmployeeDialog1() {
    this.showEmpDialog1 = false;
  }
  filterEmployeeNamesop() {
    if (this.searchEmpop) {
      this.filteredEmpOptionsop = this.empOptionop.filter(emp => emp.name.toLowerCase().includes(this.searchEmpop.toLowerCase()));
    } else {
      this.filteredEmpOptionsop = this.empOptionop;
    }
  }

  filterEmployeeNames() {
    if (this.searchEmp) {
      this.filteredEmpOptions = this.empOption.filter(emp => emp.name.toLowerCase().includes(this.searchEmp.toLowerCase()));
    } else {
      this.filteredEmpOptions = this.empOption;
    }
  }

  filterOptions() {
    this.filteredOptions = this.itemOption.filter(option =>
      option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filtercustcode() {
    if (this.searchcustcode) {
      this.filteredcustcodeOptions = this.custcodeOption.filter(emp =>
        emp.name.toLowerCase().includes(this.searchcustcode.toLowerCase())
      );
    } else {
      this.filteredcustcodeOptions = this.custcodeOption;
    }
  }

  filterworkorderpart() {
    if (this.searchworkorderpart) {
      this.filteredworkorderOptions = this.workorderOption.filter(emp => emp.name.toLowerCase().includes(this.searchworkorderpart.toLowerCase()));
    } else {
      this.filteredworkorderOptions = this.workorderOption;
    }
  }


  filterfgname() {
    if (this.searchfgname) {
      this.filteredfgnameOptions = this.fgnameOption.filter(emp => emp.name.toLowerCase().includes(this.searchfgname.toLowerCase()));
    } else {
      this.filteredfgnameOptions = this.fgnameOption;
    }
  }

  showworkorderDialog(item: any): void {
    this.currentItem = item;
    this.showworkorder = true;
    
  }

  hideworkorderDialog() {
    this.showworkorder = false;
  }

  showEmployeeDialog(item: any): void {
    this.currentItem = item;
    this.showEmpDialog = true;
  }
  hideEmployeeDialog() {
    this.showEmpDialog = false;
  }

  selectfgname(emp: any): void {
    if (this.currentItem) {
      this.currentItem.fg_name = emp.name;
    }
    this.hidefgnameDialog();
  }
  selectworkorder(emp: any): void {
    if (this.currentItem) {
      this.currentItem.work_order = emp.name;
    }
    this.hideworkorderDialog();
  }
  selectemp(emp: any): void {
    if (this.currentItem) {
      this.currentItem.settername = emp.name;
    }
    this.hideEmployeeDialog();
  }

  selectemp1(emp: any): void {
    if (this.currentItem) {
      this.currentItem.operatorname = emp.name;
    }
    this.hideEmployeeDialog1();
  }


  



  showfgnameDialog(item: any): void {
    this.currentItem = item;
    this.showfgname = true;
  }

  hidefgnameDialog() {
    this.showfgname = false;
  }
  showcustcodeDialog(item: any): void {
    this.currentItem = item;
    this.showcustcode = true;
  }

  hidecustcodeDialog() {
    this.showcustcode = false;
  }
  selectcustcode(emp: any): void {
    if (this.currentItem) {
      this.currentItem.cust_code = emp.name;

    }
    this.hidecustcodeDialog();
  }
  openDialog(item: any): void {
    this.selectedItem = item;
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }
  editRecord(item: any): void {
    // Log start and end times
    console.log('Start Time:', item.starttime);
    console.log('End Time:', item.endtime);
    if (typeof item.starttime === 'string') {
      item.starttime = new Date(item.starttime);
    }
    if (typeof item.endtime === 'string') {
      item.endtime = new Date(item.endtime);
    }
    item.starttime = new Date(item.starttime.getTime() + item.starttime.getTimezoneOffset() * 60000);
    item.endtime = new Date(item.endtime.getTime() + item.endtime.getTimezoneOffset() * 60000);


    item.isEditing = true;
  }

  selectMachine(machineValue: string): void {
    if (this.selectedItem) {
      // Update the selectedItem's machine number
      this.selectedItem.machineno = machineValue;
    }

    this.closeDialog();
  }



  saveRecord(item: any): void {
    console.log('Processtype before update:', item.processtype);

    // Convert the time to a proper format (like 'HH:mm:ss')
    item.starttime = this.formatTimeForBackend(item.starttime);
    item.endtime = this.formatTimeForBackend(item.endtime);

    this.dataService.updateRecord(item.id, item).subscribe(
      (response) => {
        console.log('Record updated:', response);
        item.isEditing = false;
        window.location.reload();

      },
      
      (error) => {
        console.error('Error updating record:', error);
      }
    );
  }

  // Method to format the time for backend
  formatTimeForBackend(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  onSubmit() {
    // Initialize the filtered list as a copy of the original process list
    this.filteredProcess = this.process;
  
    // Filter by machine if selected
    if (this.selectedMachine) {
      this.filteredProcess = this.filteredProcess.filter(
        item => item.machineno === this.selectedMachine
      );
    }
  
    // Filter by date range if both dates are provided
    if (this.dateFrom && this.dateTo) {
      const fromDate = new Date(this.dateFrom);
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire 'toDate'
      this.filteredProcess = this.filteredProcess.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
  
    // Update the paginated process or display the filtered results
    this.updatePaginatedProcess();
  }
  
  deleteRecord(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.dataService.deleteRecord(id).subscribe(
        (response) => {
          console.log('Record deleted:', response);
          this.filteredProcess = this.filteredProcess.filter(item => item.id !== id);
          this.updatePaginatedProcess();
        },
        (error) => {
          console.error('Error deleting record:', error);
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
      html2canvas(data, { scale: 5 }).then(canvas => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('SummaryTable.pdf');
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedProcess();
  }
  updatePaginatedProcess(): void {
    this.paginatedProcess = this.filteredProcess.slice(this.first, this.first + this.rows);
  }
  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  formatTime1(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  }

  selectItemOrProcess(option: any): void {
      // Set part ID and fetch related details

      this.currentItem.itemcode = option.name;
      this.dataService.getItemDetails(option.name).subscribe(
        data => {
          this.currentItem.itemname = data.part_name; // Update part name based on part ID
          this.currentItem.itemcode = data.part_id;
        },
        error => {
          console.error('Error fetching item details:', error);
        }
      );
      this.searchTerm = '';
      this.filteredOptions = this.itemOption; // Reset filter options
    
    this.showItemDialog = false;

  }

  showOptionDialog1(item: any):void {

    this.currentItem=item;
      this.showItemDialog = true;

  }

  hideOptionDialog1() {
      this.showItemDialog = false;

  }

}