import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx';  // For Excel export
import 'jspdf-autotable';      // For PDF table generation
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  templateUrl: './reasondemo.component.html',
})
export class ReasonDemoComponent implements OnInit  {
  process: any[];
  custcodeOption: { name: string; }[];
  filteredcustcodeOptions: { name: string; }[];
  showcustcode: boolean;
  searchcustcode: any;
  custcode: any;
  fgnameOption: { name: string; }[];
  filteredfgnameOptions: { name: string; }[];
  showfgname: any;
  fgname: any;
  searchfgname: any;
  itemOption: { name: string; }[];
  filteredOptions: { name: string; }[];
  searchTerm: string;
  value5: any;
  showItemDialog: any;
   fromDate: Date | null = null;
  toDate: Date | null = null;
  empOption: { name: string; }[];
  filteredEmpOptions: { name: string; }[];
  empOptionop: { name: string; }[];
  filteredEmpOptionsop: { name: string; }[];
valueopt: any;
value: any;
  showEmpDialog: boolean;
  showEmpDialog1: boolean;
  searchEmp: any;
  searchEmpop: any;
  showSetterDialog: any;
  showSetterDialog1: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.loadMachineReports();

        // setter call
        this.dataService.getEmpitemNames().subscribe((names: string[]) => {
          this.empOption = names.map(name => ({ name }));
          this.filteredEmpOptions = this.empOption;
        });

        // operator call
        this.dataService.getEmpitemNamesop().subscribe((names: string[]) => {
          this.empOptionop = names.map(name => ({ name }));
          this.filteredEmpOptionsop = this.empOptionop;
        });


  }


    // Load the machine reports
    loadMachineReports() {
      this.dataService.getmachineempreports().subscribe(
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
      this.value = null;
      this.valueopt = null;
  
      // Reload the full data
      this.loadMachineReports();
    }


  
  
    // setter emp name
    selectemp(option: any) {
      this.value = option.name;
  
        if (this.showSetterDialog) {
          this.value = option.name;
        }
  
      
      this.hideEmployeeDialog();
    }
  

  
    selectemp1(option: any) {
      this.valueopt = option.name;

        if (this.showSetterDialog1) {
          this.valueopt = option.name;
        }
        this.hideEmployeeDialog1();
    }


    showEmployeeDialog() {
      this.showEmpDialog = true;
    }
  
    showEmployeeDialog1() {
      this.showEmpDialog1 = true;
    }
  
    hideEmployeeDialog() {
      this.showEmpDialog = false;
    }
  
    hideEmployeeDialog1() {
      this.showEmpDialog1 = false;
    }



  filterEmployeeNames() {
    if (this.searchEmp) {
      this.filteredEmpOptions = this.empOption.filter(emp =>  (emp.name ? emp.name.toLowerCase(): '').includes(this.searchEmp.toLowerCase()));
    } else {
      this.filteredEmpOptions = this.empOption;
    }
  }
  filterEmployeeNamesop() {
    if (this.searchEmpop) {
      this.filteredEmpOptionsop = this.empOptionop.filter(emp =>  (emp.name ? emp.name.toLowerCase(): '').includes(this.searchEmpop.toLowerCase()));
    } else {
      this.filteredEmpOptionsop = this.empOptionop;
    }
  }


  applyFilters() {
    const filters = {
      settername: this.value || '',  // Setter name filter
      operatorname: this.valueopt || '',  // Operator name filter
      fromDate: this.fromDate ? this.formatDate(this.fromDate) : '',  // Date range filters
      toDate: this.toDate ? this.formatDate(this.toDate) : ''
    };
  
    this.dataService.getFilteredempReports(filters).subscribe(
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
        console.error('Error fetching filtered data', error);
      }
    );
  }
  

  
  // Helper method to format date as 'yyyy-mm-dd'
  formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
  
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-'); // yyyy-mm-dd
  }
  
  
  // Helper method to format date as 'yyyy-mm-dd'
  private exformatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
  
    return [day.padStart(2, '0'), month.padStart(2, '0'), year].join('-');
  }
  

  exportExcel() {
    // Prepare data array to reflect the updated table structure
    const displayedData = this.process.map((part, index) => ({
      'S.No': index + 1,
      'Plan Date': part.date ? this.exformatDate(part.date) : '', // Plan Date
      'Employee Name': `${part.settername || ''} ${part.operatorname || ''}`.trim(), // Combined employee names, empty if no name
      'Machine Name': part.machineno || '', // Machine Name
      'Cust Code': part.cust_code || '', // Cust Code
      'FG Name': part.fg_name || '', // FG Name
      'Item Code': part.itemcode || '', // Item Code
      'Item Name': part.itemname || '', // Item Name
      'Planned Start Date': part.date ? this.exformatDate(part.date) : '', // Planned Start Date
      'Planned Start Time': part.starttime ? this.formatTime1(part.starttime) : '', // Planned Start Time
      'Planned Completed Date': part.date ? this.exformatDate(part.date) : '', // Planned Completed Date
      'Planned Completed Time': part.endtime ? this.formatTime1(part.endtime) : '', // Planned Completed Time
      'Planned Duration': part.durationHoursPlan || '', // Product Quantity
      'Achieved Start Date': part.start_datetime ? this.exformatDate(part.start_datetime) : '', // Achieved Start Date
      'Achieved Start Time': part.start_datetime ? this.formatTime1(part.start_datetime) : '', // Achieved Start Time
      'Achieved Completed Date': part.end_datetime ? this.exformatDate(part.end_datetime) : '', // Achieved Completed Date
      'Achieved Completed Time': part.end_datetime ? this.formatTime1(part.end_datetime) : '', // Achieved Completed Time
      'Achieved Duration': part.durationHours || '', // Product Quantity
      'Cycle Time(In Mins)': part.plannedcycletime || '', // Achieved Quantity
      'Product Qty': part.planquantity || '', // Product Quantity
      'Achieved Qty': part.emp_accpt_count || '', // Achieved Quantity
    }));
  
    // Convert data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(displayedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'EmployeeReports': worksheet }, SheetNames: ['EmployeeReports'] };
  
    // Export workbook to Excel file
    XLSX.writeFile(workbook, 'EmployeeReports.xlsx');
  }
  
  formatTime1(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = ('0' + date.getUTCHours()).slice(-2); // Use UTC hours to avoid timezone issues
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  }

// Utility function to format time as HH:mm (railway time)
private formatTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

  
  
  
  
  exportPdf(): void { 
    const doc = new jsPDF();
    
    const imageUrl = 'assets/layout/images/cri.png';
    const img = new Image();
    img.src = imageUrl;
  
    img.onload = () => {
      const imgX = 150;
      const imgY = 10;
      const imgWidth = 45;
      const imgHeight = 15;
      doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
  
      const titleX = imgX - 140;
      const titleY = imgY + 10;
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Employee Reports', titleX, titleY);
  
      // Get current date and time
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
      const formattedDateTime = `${day}-${month}-${year}, ${hours}:${minutes}`;
      const downloadText = `Generated on ${formattedDateTime}`;
  
      // Add the formatted date and time below the title
      const dateTimeX = titleX;
      const dateTimeY = titleY + 10;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(downloadText, dateTimeX, dateTimeY); 
  
      doc.setLineWidth(0.2);
      doc.line(5, dateTimeY + 5, 203, dateTimeY + 5); 
  
      const displayedData = this.process.map((part, index) => ({
        'S.No': index + 1,
        'Employee Name': `${part.settername} ${part.operatorname}`, // Combined employee names
        'Plan Date': part.date,
        'Start Date/Time': `${new Date(part.date).toLocaleDateString('en-GB')} / ${new Date(part.starttime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        'Completed Date/Time': `${new Date(part.date).toLocaleDateString('en-GB')} / ${new Date(part.endtime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        'Machine Name': part.machineno,
        'Cust Code': part.cust_code,
        'FG Name': part.fg_name,
        'Item Code': part.itemcode,
        'Item Name': part.itemname,
        'Product Qty': part.planquantity,
        // 'Achieved Qty': part.achieved_qty || '', // Include achieved quantity if available
        // 'Achieved Start Date/Time': part.achieved_start_time || '', // Include if available
        // 'Achieved Completed Date/Time': part.achieved_completed_time || '', // Include if available
      }));
  
      const columns = [
        { header: 'S.No', dataKey: 'S.No' },
        { header: 'Employee Name', dataKey: 'Employee Name' },
        { header: 'Plan Date', dataKey: 'Plan Date' },
        { header: 'Start Date\n/Time', dataKey: 'Start Date/Time' },
        { header: 'Completed Date/Time', dataKey: 'Completed Date/Time' },
        { header: 'Machine Name', dataKey: 'Machine Name' },
        { header: 'Cust Code', dataKey: 'Cust Code' },
        { header: 'FG Name', dataKey: 'FG Name' },
        { header: 'Item Code', dataKey: 'Item Code' },
        { header: 'Item Name', dataKey: 'Item Name' },
        { header: 'Product Qty', dataKey: 'Product Qty' },
        // { header: 'Achieved Qty', dataKey: 'Achieved Qty' },
        // { header: 'Achieved Start Date/Time', dataKey: 'Achieved Start Date/Time' },
        // { header: 'Achieved Completed Date/Time', dataKey: 'Achieved Completed Date/Time ' },

      ];
  
      autoTable(doc, {
        columns: columns,
        body: displayedData,
        startY: dateTimeY + 10, 
        pageBreak: 'auto',
        margin: { top: 10, left: 10, right: 8 },
        styles: {
          overflow: 'linebreak',
          fontSize: 6,
          cellWidth: 'wrap',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: [255, 255, 255],
        },
        theme: 'grid',
        didDrawPage: (data) => {
          const pageCount   = doc.internal.pages.length - 1;
          const pageHeight  = doc.internal.pageSize.height;
          const pageWidth   = doc.internal.pageSize.width;
  
          doc.setFontSize(10);
          doc.text(`${pageCount}`, pageWidth - 20, pageHeight - 10);
        }
      });
  
      // Save the PDF
      doc.save('EmployeeReports.pdf');
    };
  
    img.onerror = (error) => {
      console.error('Image loading error:', error);
    };
  }
  
  
}
