import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx';  // For Excel export
import 'jspdf-autotable';      // For PDF table generation
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './plandemo.component.html',
})
export class PlanDemoComponent implements OnInit {
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
  }

  formatTime1(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = ('0' + date.getUTCHours()).slice(-2); // Use UTC hours to avoid timezone issues
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  }

    // Load the machine reports
    loadMachineReports() {
      this.dataService.getmachinereports().subscribe(
        data => {
          this.process = data.map(record => {
        // Parse starttime and endtime without altering the original object
        const starttime = new Date(record.starttime); // Assumes valid input
        const endtime = new Date(record.endtime);     // Assumes valid input

        const durationHoursPlan = (
          (endtime.getTime() - starttime.getTime()) / (1000 * 60 * 60)
        ).toFixed(2);
      
            // Add the calculated durations to the record
            return { ...record, durationHoursPlan };
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


  applyFilters() {
    const filters = {
      cust_code: this.custcode || '',
      fg_name: this.fgname || '',
      part_id: this.value5 || '',
      fromDate: this.fromDate ? this.formatDate(this.fromDate) : '',
      toDate: this.toDate ? this.formatDate(this.toDate) : ''
    };
  
    this.dataService.getFilteredReports(filters).subscribe(
      data => {
        this.process = data.map(record => {
      // Parse starttime and endtime without altering the original object
      const starttime = new Date(record.starttime); // Assumes valid input
      const endtime = new Date(record.endtime);     // Assumes valid input

      const durationHoursPlan = (
        (endtime.getTime() - starttime.getTime()) / (1000 * 60 * 60)
      ).toFixed(2);

    
          // Add the calculated durations to the record
          return { ...record, durationHoursPlan };
        });
      },
      error => {
        console.error('Error fetching filtered data', error);
      }
    );
  }
  
  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
  
    return `${year}-${month}-${day}`;
  }
  
  


// Export only visible table data to Excel
exportExcel() {
  // Prepare data array in the same structure as displayed in the table
  const displayedData = this.process.map((part, index) => ({
    'S.No': index + 1,
    'Plan Date': part.date ? this.exformatDate(part.date) : '', // Plan Date
    'Machine Name': part.machineno || '',
    'Start Date': part.date ? this.exformatDate(part.date) : '', // Use formatDate utility
    'Start Time': part.starttime ? this.formatTime1(part.starttime) : '', // Use formatTime utility
    'Completed Date': part.date ? this.exformatDate(part.date) : '', // Use formatDate utility
    'Completed Time': part.endtime ? this.formatTime1(part.endtime) : '', // Use formatTime utility
    'Planned Duration(In Hrs)': part.durationHoursPlan || '', // Product Quantity
    'Work Order No.': part.work_order || '',
    'Cust Code': part.cust_code || '', // Ensure empty string if undefined or null
    'FG Name': part.fg_name || '',
    'Item Code': part.itemcode || '',
    'Item Name': part.itemname || '',
    'Process Name': part.process_id || '',
    'Setting/Production': part.processtype || '',
    'Setter/Operator Name': `${part.settername || ''} ${part.operatorname || ''}`.trim(), // Combine names or leave empty
    'Planned Qty': part.planquantity || '',
    'Planned Cycle Time(In Mins)': part.plannedcycletime || '',
    'Program Number':  '',


  }));

  // Convert data to worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(displayedData);

  // Create workbook
  const workbook: XLSX.WorkBook = {
    Sheets: { 'PlannedReports': worksheet },
    SheetNames: ['PlannedReports'],
  };

  // Export workbook to Excel file
  XLSX.writeFile(workbook, 'PlannedReports.xlsx');
}

private exformatDate(date: Date): string {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
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
    doc.text('Planned Reports', titleX, titleY);

    // Get current date and time
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${day}-${month}-${year}, ${hours}:${minutes}`;
    const downloadText = `Generated on ${formattedDateTime}`;

    const dateTimeX = titleX;
    const dateTimeY = titleY + 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(downloadText, dateTimeX, dateTimeY);

    doc.setLineWidth(0.2);
    doc.line(5, dateTimeY + 5, 203, dateTimeY + 5);

    const displayedData = this.process.map((part, index) => ({
      'S.No': index + 1,
      'Cust Code': part.cust_code || '',
      'FG Name': part.fg_name || '',
      'Item Code': part.itemcode || '',
      'Item Name': part.itemname || '',
      'Work Order No.': part.work_order || '',
      'Machine Name': part.machineno || '',
      'Start Date': part.date ? new Date(part.date).toLocaleDateString('en-GB') : '',
      'Start Time': part.starttime ? new Date(part.starttime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
      'Completed Date': part.date ? new Date(part.date).toLocaleDateString('en-GB') : '',
      'Completed Time': part.endtime ? new Date(part.endtime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
      'Setting/Production': part.processtype || '',
      'Setter/Operator Name': `${part.settername || ''} ${part.operatorname || ''}`.trim(),
      'Product Qty': part.planquantity || '',
    }));

    const columns = [
      { header: 'S.No', dataKey: 'S.No' },
      { header: 'Cust Code', dataKey: 'Cust Code' },
      { header: 'FG Name', dataKey: 'FG Name' },
      { header: 'Item Code', dataKey: 'Item Code' },
      { header: 'Item Name', dataKey: 'Item Name' },
      { header: 'Work Order No.', dataKey: 'Work Order No.' },
      { header: 'Machine Name', dataKey: 'Machine Name' },
      { header: 'Start Date', dataKey: 'Start Date' },
      { header: 'Start Time', dataKey: 'Start Time' },
      { header: 'Completed Date', dataKey: 'Completed Date' },
      { header: 'Completed Time', dataKey: 'Completed Time' },
      { header: 'Setting/Production', dataKey: 'Setting/Production' },
      { header: 'Setter/Operator Name', dataKey: 'Setter/Operator Name' },
      { header: 'Product Qty', dataKey: 'Product Qty' },
    ];

    autoTable(doc, {
      columns: columns,
      body: displayedData,
      startY: dateTimeY + 10,
      pageBreak: 'auto',
      margin: { top: 10, left: 6, right: 8 },
      styles: {
        overflow: 'linebreak',
        fontSize: 6,
        cellWidth: 'wrap',
        cellPadding: 1,
      },
      columnStyles: {
        'Item Name': { cellWidth: 35 },
        'Cust Code': { cellWidth: 12 },
        'FG Name': { cellWidth: 15 },
        'Item Code': { cellWidth: 15 },
        'Work Order No.': { cellWidth: 12 },
        'Machine Name': { cellWidth: 10 },
        'Setter/Operator Name': { cellWidth: 15 },
        'Completed Date': { cellWidth: 15 },
        'Completed Time': { cellWidth: 10 },
        'Setting/Production': { cellWidth: 15 },
        'Start Date': { cellWidth: 15 },
        'Start Time': { cellWidth: 10 },
        'Product Qty': { cellWidth: 10 },
        'S.No': { cellWidth: 10 },
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
      },
      theme: 'grid',
      didDrawPage: (data) => {
        const pageCount = doc.internal.pages.length - 1;
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFontSize(10);
        doc.text(`${pageCount}`, pageWidth - 20, pageHeight - 10);
      },
    });

    doc.save('PlannedReports.pdf');
  };

  img.onerror = (error) => {
    console.error('Image loading error:', error);
  };
}

}
