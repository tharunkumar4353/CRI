import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment';

interface Processtype {
  name: string;
  code: string;
}

@Component({
  templateUrl: './Machinedemo.component.html',
  providers: [MessageService, DatePipe],
})
export class MachineDemoComponent implements OnInit {
  processtype: Processtype[] | undefined;
  selectedProcesstype: Processtype | undefined;

  rows: any[] = [
    {
      selectedCNC: null,
      selectItem: null,
      selectedCustomer: null,
      value1: '',
      value2: '',
      value7: '',
      value8: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      valueopt: '',
      optname: '',
      itemName: '',
      showDialog: false,
      showItemDialog: false,
      showCustomerDialog: false,
      setterName: '',
      operatorName: '',
      optName: '',
      cycle_time: '',
      date: '',
      selectedProcesstype: null,
    },
  ];

  maxRows = 15;
  showEmpDialog1: boolean;
  optName: any;
  valueopt: any;
  showcustcode: boolean;
  custcode: any;
  custcodeOption: { name: string; }[];
  filteredcustcodeOptions: { name: string; }[];
  searchcustcode: any;
  filteredfgnameOptions: { name: any; }[];
  fgnameOption: { name: any; }[];
  showfgname: boolean;
  searchfgname: any;
  empOptionop: { name: string; }[];
  filteredEmpOptionsop: any;
  searchEmpop: any;
  filteredOptionspart: any;
  itemOptionpart: any;
  searchPartName: string;
  workorderOption: { name: string; }[];
  filteredworkorderOptions: { name: string; }[];
  searchworkorder: any;
  showworkorder: boolean;
  searchworkorderpart: any;
  least_average_day: any;
  average: any;
  selectedFileContent: null;
  searchDateFrom: any;
  searchDateTo: any;
  isSubmitted: boolean;

  addDateRow() {
    if (this.rows.length < this.maxRows) {
      this.rows.push({
        date: '',
        setterName: '',
        value7: '',
        value8: '',
        value3: '',
        optName: '',
        cycle_time: '',
        plannedCycleTime1: '',

      });
    }
  }
  // Method to remove a row by index, but not the last one
  removeDateRow(index: number) {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);  // Removes the row at the specified index if more than one row
    }
  }

  commonData: any = {
    plannumber: 'plan',
    selectedCNC: '',
    value5: '',
    itemName: '',
    value1: '',
    value2: '',
    processName: '',
    partId: '',
  };

  clearRow(): void {
    const confirmation = confirm('Are you sure you want to clear all rows?');
    if (confirmation) {
      this.rows = [
        {
          selectedCNC: null,
          selectItem: null,
          selectedCustomer: null,
          value1: '',
          value2: '',
          value7: '',
          value8: '',
          value3: '',
          value4: '',
          value5: '',
          value6: '',
          itemName: '',
          showDialog: false,
          showItemDialog: false,
          showCustomerDialog: false,
          setterName: '',
          cycle_time: '',
          plannedCycleTime1: '',
          date: ''
        }
      ];
      this.onClearRow();
    } else {
      // If user cancels, do nothing
      console.log('Clear action was cancelled');
    }
  }

  optname: any[] = [];
  process: any[] = [];
  setterNames: any[] = [];
  fromDate: string;
  toDate: string;
  columns: string[] = [];
  additionalRows: any[] = [];
  showCustomerDialog: boolean;

  showEmpDialog: boolean = false;
  value: string = '';

  isPartnameDialogVisible: boolean = false;
  value9: string = '';

  isOptionDialogVisible: boolean = false;
  value10: string = '';
  value11: string = '';
  value12: string = '';
  date1: Date = new Date();
  dateFrom: Date = new Date();
  searchdate: Date | null = null;
  dateTo: Date = new Date();
  endTime: string = '';
  startTime: string = '';
  plannedQuantity: string = '';
  plannedCycleTime: string = '';
  setterName: string = '';
  tempsetterName: string = '';
  value14: string = '';
  value18: string = '';
  value15: string = '';
  value16: string = '';
  value17: string = '';
  date2: Date = new Date();
  dateFrom1: Date = new Date();
  dateTo1: Date = new Date();
  cycle_time: any;
  process_name: any;
  filteredAllocations: any[] = [];
  items!: string[];

  constructor(
    private location: Location,
    private dataService: DataService,
    private http: HttpClient,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) { }

  processOption: any[] = [];
  customerOptions: any[] = [];
  itemOption: any[] = [];
  empOption: any[] = [];
  partOption: any[] = [];
  filteredOptions: any[] = [];
  filteredEmpOptions: any[] = [];
  cycle: number | null = null;
  searchEmp: string = '';
  searchTerm: string = '';
  searchName: string = '';
  filteredProcessOptions: any[] = [];
  filteredPartOptions: any[] = [];
  partSearchTerm: string = '';
  date: string = '';
  fileList: any[] = [];
  selectedFileId: string | null = null;
  selectedFile: File | null = null;
  filteredData: any[] = [];
  operatorName: string = '';
  operatorNames: any[] = [];
  selectedTime: Date = new Date();  // Default to current time


  popupOptions: SelectItem[] = [
    { label: 'CNC 001', value: 'CNC 001' },
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' },

  ];
  selectedMachine: string | null = null;

  machines: any[] = [
    { label: 'CNC 001', value: 'CNC 001' },
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' },
  ];

  options: { label: string, value: string }[] = [
    { label: 'CNC 001', value: 'CNC 001' },
    { label: 'CNC 002', value: 'CNC 002' },
    { label: 'CNC 003', value: 'CNC 003' },
    { label: 'CNC 004', value: 'CNC 004' },
    { label: 'CNC 005', value: 'CNC 005' },
    { label: 'VMC 001', value: 'VMC 001' },
    { label: 'VMC 002', value: 'VMC 002' },

  ];

  showOptionDialog() {
    this.isOptionDialogVisible = true;
  }



  hideOptionDialog() {
    this.isOptionDialogVisible = false;
  }

  selectsOption(option: { label: string, value: string }) {
    this.value10 = option.value;
    this.value15 = option.value;
    this.hideOptionDialog();
  }

  ngOnInit(): void {

    this.loadFileList();
    this.loadProcessData();
    this.loadSetterNames();
    this.processtype = [
      { name: 'Production', code: 'P1' },
      { name: 'Setting', code: 'P2' },

    ];

  }




  loadSetterNames(): void {
    this.dataService.getSetterNames().subscribe(
      (data) => {
        this.setterNames = data;
      },
      (error) => {
        console.error('Error fetching setter names:', error);
      }
    );
  }

  searchByDateRange() {
    if (this.setterName && this.fromDate && this.toDate) {
      // Convert Date objects to strings in 'YYYY-MM-DD' format
      const formattedFromDate = this.formatDate(this.fromDate);
      const formattedToDate = this.formatDate(this.toDate);

      this.dataService.getFilteredData(this.setterName, formattedFromDate, formattedToDate).subscribe(
        (data) => {
          this.filteredData = data;
          console.log('Filtered data:', data);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      alert('Please provide all search parameters.');
    }
  }

  searchByDateRangeoperator() {
    if (this.operatorName && this.fromDate && this.toDate) {
      const formattedFromDate = this.formatDate(this.fromDate);
      const formattedToDate = this.formatDate(this.toDate);

      this.dataService.getFilteredDataoperator(this.operatorName, formattedFromDate, formattedToDate).subscribe(
        (data) => {
          this.operatorNames = data;
          console.log('Fetched data:', data);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      alert('Please provide all search parameters.');
    }
  }


  clearSelections() {
    // Clear the fields
    this.selectedMachine = null;
    this.searchdate = null;

    // After clearing the fields, call loadProcessData to fetch the full/default data
    this.loadProcessData();
  }




  loadProcessData(): void {
    const machine = this.selectedMachine ? this.selectedMachine : null;

    // Convert 'searchDateFrom' and 'searchDateTo' to ISO strings (yyyy-mm-dd)
    let dateFrom = null;
    let dateTo = null;

    if (this.searchDateFrom) {
      const offsetDateFrom = new Date(this.searchDateFrom.getTime() - this.searchDateFrom.getTimezoneOffset() * 60000);
      dateFrom = offsetDateFrom.toISOString().split('T')[0];
    }

    if (this.searchDateTo) {
      const offsetDateTo = new Date(this.searchDateTo.getTime() - this.searchDateTo.getTimezoneOffset() * 60000);
      dateTo = offsetDateTo.toISOString().split('T')[0];
    }

    console.log('Requesting data for machine:', machine, 'from date:', dateFrom, 'to date:', dateTo);

    // Call the backend API to fetch data based on the machine and date range
    this.dataService.getMachineShowToday(machine, dateFrom, dateTo).subscribe(
      (data: any[]) => {
        this.process = data; // Populate the table with the fetched data
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );




    this.items = Array.from({ length: 1000 }).map((_, i) =>  `Item #${i}`);
    // part name id call
    this.dataService.getPartNames().subscribe((names: string[]) => {
      this.customerOptions = names.map(name => ({ name }));
    });

    // this.dataService.getPartitemNames().subscribe((names: string[]) => {
    //   this.itemOption = names.map(name => ({ name }));
    //   this.filteredOptions = this.itemOption;
    // });

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
    


    this.dataService.getPartitemNamespart().subscribe(
      (names: any[]) => {

        this.itemOptionpart = names.map(name => ({ name }));
        this.filteredOptionspart = this.itemOptionpart;
      },
      error => {
        console.error('Error fetching part names:', error);
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
    

    // cust name call
    this.dataService.getPartdataexcel().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.custcodeOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredcustcodeOptions = this.custcodeOption;
    });
    
    // // fg name call
    // this.dataService.getPartdataexcel1().subscribe((names: string[]) => {
    //   this.fgnameOption = names.map(name => ({ name }));
    //   this.filteredfgnameOptions = this.fgnameOption;
    // });

    // compo name call
    this.dataService.getPartmacNames().subscribe((names: string[]) => {
      // Sort the names alphabetically
      const sortedNames = names.sort((a, b) => a.localeCompare(b));
    
      // Map the sorted names to the desired format
      this.partOption = sortedNames.map(name => ({ name }));
    
      // Set the filtered options
      this.filteredPartOptions = this.partOption;
    });
    

    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }

  updateSubmitted(id: number): void {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to update the status?');

    if (isConfirmed) {
      this.dataService.updateSubmittedStatusmachine(id).subscribe(
        (response: any) => {
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status updated successfully' });
            this.loadProcessData(); // Reload data to reflect changes
          }
        },
        (error) => {
          console.error('Error updating status:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
        }
      );
    } else {
      this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Update cancelled' });
    }
  }



  loadFileList(): void {
    this.dataService.getFileListdemo().subscribe(
      files => this.fileList = files,
      error => console.error('Error fetching file list:', error)
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.dataService.uploadFiledemo(this.selectedFile).subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          alert('File uploaded successfully'); // Show alert after successful upload
          this.loadFileList(); // Load the file list or perform any additional actions
        },
        error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file'); // Show alert in case of an error
        }
      );
    } else {
      alert('Please select a file to upload');
    }
  }


  filterOptions() {
    this.filteredOptions = this.itemOption.filter(option =>
      (option.name ? option.name.toLowerCase() : '').includes(this.searchTerm.toLowerCase())
    );
  }
  filterOptionspart() {
    this.filteredOptionspart = this.itemOptionpart.filter(option =>
      (option.name ? option.name.toLowerCase() : '').includes(this.searchPartName.toLowerCase())
    );
  }

  filterProcessOptions() {
    this.filteredProcessOptions = this.processOption.filter(option =>
      (option.name ? option.name.toLowerCase() : '').includes(this.searchName.toLowerCase())
    );
  }

  selectOption(option: SelectItem, row: any) {
    this.commonData.selectedCNC = option.label;
    row.showDialog = false;
  }



  selectItemOrProcess(option: any, row: any, actionType: string) {
    if (actionType === 'item') {
      // Set part ID and fetch related details
      this.commonData.value5 = option.name;
      this.dataService.getItemDetails(option.name).subscribe(
        data => {
          this.commonData.itemName = data.part_name; // Update part name based on part ID
          this.commonData.partId = data.part_id;
          this.fetchProcessNames(option.name); // Fetch process names
        },
        error => {
          console.error('Error fetching item details:', error);
        }
      );
      this.searchTerm = '';
      this.filteredOptions = this.itemOption; // Reset filter options
    } else if (actionType === 'part') {
      // Set part name and fetch related part ID
      this.commonData.itemName = option.name;
      this.dataService.getItemDetails(option.name).subscribe(
        data => {
          this.commonData.value5 = data.part_id; // Update part ID based on part name
          this.commonData.partId = data.part_id;
          this.fetchProcessNames(option.name);

        },
        error => {
          console.error('Error fetching part details:', error);
        }
      );
      this.searchPartName = '';
      this.filteredOptionspart = this.itemOptionpart; // Reset filter options
    } else if (actionType === 'process') {
      // Handle process selection (existing logic)
      this.commonData.value2 = option.name;
      this.dataService.getProcessNameDetails(option.name).subscribe(
        data => {
          this.commonData.process_name = data.process_name;
          this.commonData.processName = data.process_name;
          this.fetchProcessNames(option.name);
          this.fetchCycle();
        },
        error => {
          console.error('Error fetching process details:', error);
        }
      );
      this.searchName = '';
      this.filteredProcessOptions = this.processOption; // Reset filter options
    }
    // Call fetchCycle() after setting the values
    setTimeout(() => {
      this.fetchCycle();
    }, 0);


    // Close the appropriate dialog
    row.showItemDialog = false;
    row.showPartNameDialog = false; // Close part name dialog
    row.showCustomerDialog = false;
  }

  fetchCycle() {
    const { value5, process_name } = this.commonData;
    if (!value5 || !process_name) {
      console.log('Part ID or Process Name is missing');
      return;
    }

    console.log('Selected Part ID (value5):', value5);
    console.log('Selected Process Type (process_name):', process_name);

    this.dataService.getCycle(value5, process_name).subscribe(
      (response) => {
        this.least_average_day = response.least_average_day;  // Store the date with the least cycle time
        this.average = response.cycle_time;  // Store the corresponding cycle time
        console.log('Day with least cycle time:', this.least_average_day);
        console.log('Cycle value on that day:', this.average);
      },
      (error) => {
        if (error.status === 404) {
          console.log('No data found for the given part ID and process name');
          this.least_average_day = null;
          this.average = null;
        } else {
          console.error('Error fetching cycle:', error);
        }
      }
    );
  }



  fetchProcessNames(partId: string) {
    this.dataService.getProcessNamesByPartId(partId).subscribe(
      processNames => {
        this.processOption = processNames.map(name => ({ name }));
        this.filteredProcessOptions = this.processOption;
      },
      error => {
        console.error('Error fetching process names:', error);
      }
    );
  }

  showOptionDialog1(row: any, dialogType: string) {
    if (dialogType === 'item') {
      this.filteredOptions = this.itemOption; // Ensure filtered options are updated before showing dialog
    } else if (dialogType === 'process') {
      this.filteredProcessOptions = this.processOption; // Ensure filtered process options are updated before showing dialog
    }

    if (dialogType === 'item') {
      row.showItemDialog = true;
    } else if (dialogType === 'process') {
      row.showCustomerDialog = true;
    }
  }

  hideOptionDialog1(row: any, dialogType: string) {
    if (dialogType === 'item') {
      row.showItemDialog = false;
    } else if (dialogType === 'process') {
      row.showCustomerDialog = false;
    }
  }


  // setter emp name
  selectemp(option: any) {
    this.setterName = option.name;
    this.value = option.name;

    this.rows.forEach(row => {
      if (row.showSetterDialog) {
        row.setterName = option.name;
      }

    });
    this.hideEmployeeDialog();
  }



  // Function to handle setting employee name for selectemp1
  selectemp1(option: any) {
    // Set the selected operator details
    this.valueopt = option.name;
    this.operatorName = option.name;

    // Clear the filtered options after selection

    // If you are updating rows, ensure that it happens dynamically
    this.rows.forEach(row => {
      if (row.showSetterDialog1) {
        row.optName = option.name;
      }
    });

    // Hide the dialog after selection
    this.hideEmployeeDialog1();
  }



  selectcustcode(option: any) {
    this.commonData.custcode = option.name;

    this.rows.forEach(row => {
      if (row.showcustcode) {
        row.custcode = option.name;
      }

    });
    this.hidecustcodeDialog();
    this.fetchFilteredFgNames(option.name);
  }

  fetchFilteredFgNames(custCode: string) {
    this.dataService.getFilteredFgNames(custCode).subscribe((names: string[]) => {
      // Map the FG names into an array of objects and assign them to fgnameOption
      this.fgnameOption = names.map(name => ({ name }));
      // Filter the FG name options accordingly
      this.filteredfgnameOptions = this.fgnameOption;
    });
  }
  

  // selectworkorder(option: any) {
  //   this.commonData.workorder = option.name;

  //   this.rows.forEach(row => {
  //     if (row.showworkorder) {
  //       row.workorder = option.name;
  //     }

  //   });
  //   this.hideworkorderDialog();
  // }

  // Function to handle work order selection
  selectworkorder(option: any, row: any, actionType: string) {
    if (actionType === 'work') {
      // Update the selected work order
      this.commonData.workorder = option.name;

      // Fetch details based on work order and populate the fields
      this.dataService.getworkorderdetails(option.name).subscribe(
        data => {
          // Populate ngModel bound fields
          this.commonData.custcode = data.cust_code;
          this.commonData.fgname = data.fg_name;
          this.commonData.itemName = data.part_name;
          this.commonData.value5 = data.part_id;

          // Fetch process names if needed
          this.fetchProcessNames(option.name);
        },
        error => {
          console.error('Error fetching work order details:', error);
        }
      );
    }
    // Close the dialog
    this.hideworkorderDialog();
  }

  // // Function to handle work order selection
  // selectfgname(option: any, row: any, actionType: string) {
  //   if (actionType === 'fgname') {
  //     // Update the selected work order
  //     this.commonData.fgname = option.name;

  //     // Fetch details based on work order and populate the fields
  //     this.dataService.getfgnamedetails(option.name).subscribe(
  //       data => {
  //         // Populate ngModel bound fields
  //         this.commonData.itemName = data.part_name;
  //         this.commonData.value5 = data.part_id;

  //         // Fetch process names if needed
  //         this.fetchProcessNames(option.name);
  //       },
  //       error => {
  //         console.error('Error fetching work order details:', error);
  //       }
  //     );
  //   }
  //   // Close the dialog
  //   this.hidefgnameDialog();  
  //   }

  selectfgname(option: any, row: any, field: string) {
    this.commonData.fgname = option.name;

    this.rows.forEach(row => {
      if (row.showfgname) {
        row.fgname = option.name;
      }

    });
    this.hidefgnameDialog();
    this.fetchPartIdsByFgName(option.name, row);
  }

  fetchPartIdsByFgName(fgname: string, row: any) {
    this.dataService.getPartIdsByFgName(fgname).subscribe((names: string[]) => {
      // Map the part IDs into an array of objects and assign them to itemOption
      row.itemOption = names.map(name => ({ name }));
      // Filter the options to display in the dialog
      row.filteredOptions = row.itemOption;
    });
  }
  

  partData: any[] = [];

  fetchPartDataAndMatch() {
    this.dataService.getExcelpart().subscribe(partData => {
      this.partData = partData;
      this.filteredAllocations.forEach(allocation => {
        const matchedPart = this.partData.find(part => part.part_id === allocation.itemcode && part.process_id === allocation.process_id);
        allocation.program_no = matchedPart ? matchedPart.program_no : null;
      });
    }, error => {
      console.error('Error fetching part data', error);
    });
  }


  showEmployeeDialog() {
    this.showEmpDialog = true;
  }

  showcustcodeDialog() {
    this.showcustcode = true;
  }

  showworkorderDialog() {
    this.showworkorder = true;
  }

  showfgnameDialog() {
    this.showfgname = true;
  }

  showEmployeeDialog1() {
    this.showEmpDialog1 = true;
  }

  hideEmployeeDialog() {
    this.showEmpDialog = false;
  }

  hidecustcodeDialog() {
    this.showcustcode = false;
  }

  hideworkorderDialog() {
    this.showworkorder = false;
  }
  hidefgnameDialog() {
    this.showfgname = false;
  }


  hideEmployeeDialog1() {
    this.showEmpDialog1 = false;
  }

  filterEmployeeNames() {
    if (this.searchEmp) {
      this.filteredEmpOptions = this.empOption.filter(emp => (emp.name ? emp.name.toLowerCase() : '').includes(this.searchEmp.toLowerCase()));
    } else {
      this.filteredEmpOptions = this.empOption;
    }
  }
  filterEmployeeNamesop() {
    if (this.searchEmpop) {
      this.filteredEmpOptionsop = this.empOptionop.filter(emp => (emp.name ? emp.name.toLowerCase() : '').includes(this.searchEmpop.toLowerCase()));
    } else {
      this.filteredEmpOptionsop = this.empOptionop;
    }
  }

  filtercustcode() {
    if (this.searchcustcode) {
      this.filteredcustcodeOptions = this.custcodeOption.filter(emp => (emp.name ? emp.name.toLowerCase() : '').includes(this.searchcustcode.toLowerCase()));
    } else {
      this.filteredcustcodeOptions = this.custcodeOption;
    }
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


  filterfgname() {
    if (this.searchfgname) {
      this.filteredfgnameOptions = this.fgnameOption.filter(emp => (emp.name ? emp.name.toLowerCase() : '').includes(this.searchfgname.toLowerCase()));
    } else {
      this.filteredfgnameOptions = this.fgnameOption;
    }
  }



  // component name
  selectPart(option: any) {
    this.value9 = option.name;
    this.value18 = option.name;
    this.hidePartnameDialog();
  }

  showPartnameDialog() {
    this.isPartnameDialogVisible = true;
  }

  hidePartnameDialog() {
    this.isPartnameDialogVisible = false;
  }

  filterPartNames() {
    if (this.partSearchTerm) {
      this.filteredPartOptions = this.partOption.filter(part => (part.name ? part.name.toLowerCase() : '').includes(this.partSearchTerm.toLowerCase()));
    } else {
      this.filteredPartOptions = this.partOption;
    }
  }

  clearoperator() {

    this.valueopt = '';
    this.rows = this.rows.map(row => ({
      optName: '',


    }));
  }

  clearsetter() {

    this.value = '';
    this.rows = this.rows.map(row => ({
      setterName: '',


    }));
  }

  onClear() {
    this.commonData = {
      selectedCNC: '',
      workorder: '',
      custcode: '',
      fgname: '',
      value5: '',
      itemName: '',
      value1: '',
      value2: ''
    };
    this.rows = this.rows.map(row => ({
      selectedCNC: null,
      selectItem: null,
      selectedCustomer: null,
      value1: '',
      value2: '',
      value7: '',
      value8: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      itemName: '',
      showDialog: false,
      showItemDialog: false,
      showCustomerDialog: false,
      setterName: '',
      plannedCycleTime1: '',

    }));
    this.date = '';
    this.cycle_time = '';

  }

  onFileSelecteddraw(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileContent = null; // Reset content on new selection

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileContent = e.target.result; // Store the file content
      };
      reader.readAsArrayBuffer(this.selectedFile); // Read as ArrayBuffer for binary
    }
  }


  onSubmit() {
    this.isSubmitted = true; // Set submission flag

    // Check if all common data and rows are valid
    const isCommonDataValid = this.commonData.selectedCNC && this.commonData.workorder && this.commonData.fgname && this.commonData.custcode && this.commonData.value5 && this.commonData.itemName && this.commonData.value1 && this.commonData.value2 && this.commonData.process_name;

    const isRowsValid = this.rows.every(row =>
      row.date &&
      row.value7 &&
      row.value8 &&
      row.value3 &&
      row.plannedCycleTime1
    );

    if (!isCommonDataValid || !isRowsValid) {
      alert('Please fill in all required fields in rows before submitting the form.');
      return; // Stop the submission process
    }

    // Confirm with the user before proceeding
    const confirmed = window.confirm('Are you sure you want to submit the form?');

    if (confirmed) {
      // Format rows and prepare payload
      const formattedRows = this.rows.map(row => ({
        date: this.formatDate(row.date),
        setterName: row.setterName,
        optName: row.optName,
        startTime: this.formatTime(row.value7),
        endTime: this.formatTime(row.value8),
        planQuality: row.value3,
        plannedCycleTime1: row.plannedCycleTime1,
        selectedProcesstype: row.selectedProcesstype ? row.selectedProcesstype.name : null,
      }));

      const payload = {
        ...this.commonData,
        rows: formattedRows,
        drawingName: this.selectedFile ? this.selectedFile.name : null, // If no file, pass null
        drawingContent: this.selectedFileContent || null  // If no content, pass null
      };

      console.log('Submitting the following data:', payload);

      // Call your service method to post data to the backend
      this.dataService.allocation(payload).subscribe(
        response => {
          console.log('Data inserted successfully:', response);

          // Show success alert
          alert('Data inserted successfully!');

          // Reset form or handle success as needed
          this.onClear();
          window.location.reload();
        },
        error => {
          console.error('Error occurred while inserting data:', error);
          if (error.error) {
            console.error('Detailed error information:', error.error);
          }
        }
      );
    } else {
      console.log('Form submission was cancelled.');
    }
  }


  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }

  formatTime(time: string): string {
    return moment(time, ['HH:mm:ss', 'HH:mm']).format('HH:mm:ss');
  }

  submitForm() {

    const data = {

      setterName: this.value,
      optName: this.valueopt,
      startTime: this.value11,
      endTime: this.value12,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,

    };
    this.rows.forEach(row => {
      if (row.showSetterDialog) {
        row.value7 = this.datePipe.transform(this.value11, 'HH:mm'); // Format to show time only
        row.value8 = this.datePipe.transform(this.value12, 'HH:mm');   // Format to show time only
      }

    });


    this.dataService.insertmachineData(data).subscribe(response => {
      console.log('Data inserted successfully:', response);

      this.rows.forEach(row => row.showSetterDialog = false);


      this.value11 = '';
      this.value12 = '';
      this.dateFrom = null;
      this.dateTo = null;


    }, error => {
      console.error('Error inserting data:', error);
    });
  }
  formatTime1(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = ('0' + date.getUTCHours()).slice(-2); // Use UTC hours to avoid timezone issues
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  }
  submitFormopt() {

    const data = {

      setterName: this.value,
      optName: this.valueopt,
      startTime: this.value11,
      endTime: this.value12,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,

    };
    this.rows.forEach(row => {
      if (row.showSetterDialog1) {
        row.value7 = this.datePipe.transform(this.value11, 'HH:mm'); // Format to show time only
        row.value8 = this.datePipe.transform(this.value12, 'HH:mm');   // Format to show time only
      }
    });


    this.dataService.insertmachineData(data).subscribe(response => {
      console.log('Data inserted successfully:', response);

      this.rows.forEach(row => row.showSetterDialog1 = false);

      this.value11 = '';
      this.value12 = '';
      this.dateFrom = null;
      this.dateTo = null;


    }, error => {
      console.error('Error inserting data:', error);
    });
  }
  onClearRow() {
    this.commonData = {
      selectedCNC: '',
      value5: '',
      itemName: '',
      value1: '',
      value2: '',

    };
    this.rows = this.rows.map(row => ({
      ...row,
      date: '',
      setterName: '',
      value7: '',
      value8: '',
      value3: '',
      plannedCycleTime1: '',

    }));
    this.cycle_time = '';
  }
  isScrolledRight = false; // Track if it is scrolled to the right

  toggleScroll() {
    const scrollableElement = document.getElementById('scrollable-content');

    if (scrollableElement) {
      // Toggle between right and left scroll
      if (this.isScrolledRight) {
        // Scroll back to the start (leftmost position)
        scrollableElement.scrollTo({
          left: 0,  // Scroll to the far left (initial position)
          behavior: 'smooth'  // Smooth scrolling
        });
      } else {
        // Scroll to the far right
        scrollableElement.scrollTo({
          left: scrollableElement.scrollWidth,  // Scroll to the far right
          behavior: 'smooth'
        });
      }
      // Toggle the state
      this.isScrolledRight = !this.isScrolledRight;
    }
  }
}