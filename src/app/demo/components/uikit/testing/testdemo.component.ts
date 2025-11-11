import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx';  // For Excel export
import 'jspdf-autotable';      // For PDF table generation
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
    templateUrl: './testdemo.component.html'
})
export class TestDemoComponent { 
    process: any[];

    showcustcode: boolean;
    searchcustcode: any;
    custcode: any;
    custcodeOption: { name: string; }[];
    filteredcustcodeOptions: { name: string; }[];
    fgnameOption: { name: string; }[];
    filteredfgnameOptions: { name: string; }[];
    itemOption: { name: string; }[];
    filteredOptions: { name: string; }[];
    showfgname: any;
    fgname: any;
    searchfgname: any;

    searchTerm: string;
    value5: any;
    showItemDialog: any;
     fromDate: Date | null = null;
    toDate: Date | null = null;
workorder: any;
  workorderOption: { name: string; }[];
  filteredworkorderOptions: { name: string; }[];
  searchworkorderpart: any;
  showworkorder: boolean;
  
    constructor(private dataService: DataService) { }
  
    ngOnInit() {
  
      this.loadMachineReports();
  
  
          // cust name call
          this.dataService.getPartdataexcel().subscribe((names: string[]) => {
            this.custcodeOption = names.map(name => ({ name }));
            this.filteredcustcodeOptions = this.custcodeOption;
          });
  
          // fg name call
          this.dataService.getPartdataexcel1().subscribe((names: string[]) => {
            this.fgnameOption = names.map(name => ({ name }));
            this.filteredfgnameOptions = this.fgnameOption;
          });
  
          //part id
          this.dataService.getPartitemNames().subscribe((names: string[]) => {
            this.itemOption = names.map(name => ({ name }));
            this.filteredOptions = this.itemOption;
          });

          // workorder call
          this.dataService.getPartdataexcelwork().subscribe((names: string[]) => {
            this.workorderOption = names.map(name => ({ name }));
            this.filteredworkorderOptions = this.workorderOption;
    });
    }
  
  
      // Load the machine reports
      loadMachineReports() {
        // this.dataService.getmachineprodreports().subscribe(
        //   data => {
        //     this.process = data;
        //   },
        //   error => {
        //     console.error('Error fetching summary data', error);
        //   }
        // );


        this.dataService.getmachineprodreports().subscribe(
          data => {
            this.process = data.map(record => {
          // Parse starttime and endtime without altering the original object
          const starttime = new Date(record.starttime); // Assumes valid input
          const endtime = new Date(record.endtime);     // Assumes valid input
    
          const durationHoursPlan = (
            (endtime.getTime() - starttime.getTime()) / (1000 * 60)
          );

          const planstarttime = new Date(record.start_datetime); // Assumes valid input
          const planendtime = new Date(record.end_datetime);     // Assumes valid input
    
          const durationHours = (
            (planendtime.getTime() - planstarttime.getTime()) / (1000 * 60)
          ).toFixed(2);
    
        
              // Add the calculated durations to the record
              return { ...record, durationHoursPlan, durationHours };
            });
          },
          error => {
            console.error('Error fetching summary data', error);
          }
        );
      
      }
    
      // Reset the filters and reload the original data
      resetFilters() {
        this.custcode = null;
        this.fgname = null;
        this.value5 = null;
        this.workorder = null;

        // Reload the full data
        this.loadMachineReports();
      }
  
    selectcustcode(option: any) {
      this.custcode = option.name;
  
        if (this.showcustcode) {
          this.custcode = option.name;
        }
  
      
      this.hidecustcodeDialog();
    }
  
    selectfgname(option: any) {
      this.fgname = option.name;
  
        if (this.showfgname) {
         this.fgname = option.name;
        }
  
      this.hidefgnameDialog();
    }


    selectworkorder(option: any) {
        this.workorder = option.name;
        if (this.showworkorder) {
          this.workorder = option.name;
         }
      
      this.hideworkorderDialog();
    }
  
    selectItemOrProcess(option: any) {
        // Set part ID and fetch related details
        this.value5 = option.name;
        if (this.showItemDialog) {
          this.value5 = option.name;
         }
        this.searchTerm = '';
        this.filteredOptions = this.itemOption; // Reset filter options
        this.showItemDialog = false;
    }  
  
  
    showcustcodeDialog() {
      this.showcustcode = true;
    }
    hidecustcodeDialog() {
      this.showcustcode = false;
    }
    showfgnameDialog() {
      this.showfgname = true;
    }
    hidefgnameDialog() {
      this.showfgname = false;
    }
    showworkorderDialog() {
      this.showworkorder = true;
    }
    hideworkorderDialog() {
      this.showworkorder = false;
    }
  
    filtercustcode() {
      if (this.searchcustcode) {
        this.filteredcustcodeOptions = this.custcodeOption.filter(emp => (emp.name ? emp.name.toLowerCase(): '').includes(this.searchcustcode.toLowerCase()));
      } else {
        this.filteredcustcodeOptions = this.custcodeOption;
      }
    }
  
    filterfgname() {
      if (this.searchfgname) {
        this.filteredfgnameOptions = this.fgnameOption.filter(emp => (emp.name ? emp.name.toLowerCase(): '').includes(this.searchfgname.toLowerCase()));
      } else {
        this.filteredfgnameOptions = this.fgnameOption;
      }
    }
  
    filterOptions() {
      this.filteredOptions = this.itemOption.filter(option =>
        (option.name ? option.name.toLowerCase(): '').includes(this.searchTerm.toLowerCase())
      );
    }

    filterworkorderpart() {
      if (this.searchworkorderpart) {
        this.filteredworkorderOptions = this.workorderOption.filter(emp =>
          (emp.name ? emp.name.toLowerCase() : '').includes(this.searchworkorderpart.toLowerCase())
        );
      } else {
        this.filteredworkorderOptions = this.workorderOption;
      }
    }
  
  
    applyFilters() {
      const filters = {
        cust_code: this.custcode || '',
        fg_name: this.fgname || '',
        part_id: this.value5 || '',
        work_order: this.workorder || '',
        fromDate: this.fromDate ? this.formatDate(this.fromDate) : '',
        toDate: this.toDate ? this.formatDate(this.toDate) : ''
      };
    
      this.dataService.getFilteredcompReports(filters).subscribe(
       data => {
            this.process = data.map(record => {
          // Parse starttime and endtime without altering the original object
          const starttime = new Date(record.starttime); // Assumes valid input
          const endtime = new Date(record.endtime);     // Assumes valid input
    
          const durationHoursPlan = (
            (endtime.getTime() - starttime.getTime()) / (1000 * 60)
          );
              
          const planstarttime = new Date(record.start_datetime); // Assumes valid input
          const planendtime = new Date(record.end_datetime);     // Assumes valid input
    
          const durationHours = (
            (planendtime.getTime() - planstarttime.getTime()) / (1000 * 60)
          ).toFixed(2);
    
        
              // Add the calculated durations to the record
              return { ...record, durationHoursPlan, durationHours };
            });
          },
    
        error => {
          console.error('Error fetching filtered data:', error);
        }
      );
    }
    
    // Helper function to format date as 'yyyy-MM-dd'
    formatDate(date: Date): string {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    formatTime1(dateTime: string): string {
      const date = new Date(dateTime);
      const hours = ('0' + date.getUTCHours()).slice(-2); // Use UTC hours to avoid timezone issues
      const minutes = ('0' + date.getUTCMinutes()).slice(-2);
  
      return `${hours}:${minutes}`;
    }
    
    exportExcel() {
      // Prepare data array to reflect the updated table structure
      const displayedData = this.process.map((part, index) => ({
        'S.No': index + 1,
        'Plan Date': part.date ? this.exformatDate(part.date) : '',
        'Machine Name': part.machineno || '',
        'Cust Code': part.cust_code || '',
        'FG Name': part.fg_name || '',
        'Item Code': part.itemcode || '',
        'Item Name': part.itemname || '',
        'Process Name': part.process_id || '',
        'Setting/Production': part.processtype || '',
        'Production Qty': part.planquantity || '',
        'Employee Name': `${part.settername || ''} ${part.operatorname || ''}`, // Combined employee names with fallback to empty string
        'Planned Start Date': part.date  ? `${this.formatDate(part.date)}` : '',
        'Planned Start Time': part.starttime ? `${this.formatTime1(part.starttime)}` : '',
        'Plan Duration(Minutes)': part.durationHoursPlan ||'',
        'Planned Cycle Time': part.plannedcycletime || '',
        'Actual Start Date': part.start_datetime ? `${this.exformatDate(part.start_datetime)}` : '',
        'Actual Start Time': part.start_datetime ? `${this.formatTime1(part.start_datetime)}` : '',
        'Actual Finish Date': part.end_datetime ? `${this.exformatDate(part.end_datetime)}` : '',
        'Actual Finish Time': part.end_datetime ? `${this.formatTime1(part.end_datetime)}` : '',
        'Achieved Duration(Minutes)': part.durationHours || '',
        'Achieved Cycle Time(Minutes)': '',
        'Achieved Qty': part.emp_accpt_count || '',
        'Accepted Qty': part.accept || '',
        'Rework Qty': part.rework || '', // No data provided
        'Rejected Qty': part.reject || '',




      }));
    
      // Convert data to worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(displayedData);
    
      // Apply custom header styles
      const headerKeys = Object.keys(displayedData[0]); // Get column headers
      headerKeys.forEach((key, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // Cell address for header
        if (!worksheet[cellAddress]) return; // Skip if cell doesn't exist
        worksheet[cellAddress].s = {
          font: {
            bold: true, // Make the font bold
            color: { rgb: 'FFFFFF' }, // White text
          },
          fill: {
            fgColor: { rgb: '0070C0' }, // Blue background
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true, // Ensure header text wraps
          },
        };
      });
    

    
      // Create the workbook and export it
      const workbook: XLSX.WorkBook = {
        Sheets: { CompletedReports: worksheet },
        SheetNames: ['CompletedReports'],
      };
      XLSX.writeFile(workbook, 'CompletedReports.xlsx');
    }
    
    // Helper function to format time as HH:mm (railway time)
    private formatTime(dateString: string | Date): string {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
      // Helper function to format date as 'yyyy-MM-dd'
      private exformatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
      }

    
  }
  
