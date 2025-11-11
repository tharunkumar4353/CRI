import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataService } from 'src/app/demo/service/data.service';
@Component({
    templateUrl: './welddemo.component.html'
})
export class WeldDemoComponent implements OnInit{
custcode: any;
fgname: any;
itemid: any;
itemname: any;
processname: any; 
settername: any;
value5: any;
showItemidDialog: any;
showcustcode: any;
searchcustcode: any;
showfgname: any;
searchfgname: any;
showItemDialog: any;
searchTerm: any;
custcodeOption: { name: string; }[];
filteredcustcodeOptions: { name: string; }[];
fgnameOption: { name: string; }[];
filteredfgnameOptions: { name: string; }[];
itemOption: { name: string; }[];
filteredOptions: { name: string; }[];
    process: any[];
    itemOptionpart: { name: any; }[];
    filteredOptionspart: any;
    showPartNameDialogv: any;
    searchPartName: string;
    showPartNameDialog: boolean;
    processOption: any;
    filteredProcessOptions: any;
    showCustomerDialog: any;
    searchName: string;
    selectedFile: File | null = null;

constructor(private dataService: DataService, private http: HttpClient) { }

    ngOnInit() {


    
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

            //part name
            this.dataService.getPartitemNamespart().subscribe((names: any[]) => {
               this.itemOptionpart = names.map(name => ({ name }));
               this.filteredOptionspart = this.itemOptionpart;
            });

            //process name
            this.dataService.getProcessNamesByPartIdpart().subscribe((names: any[]) => {
                  this.processOption = names.map(name => ({ name }));
                  this.filteredProcessOptions = this.processOption;
                });
          
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

      selectItemOrProcess2(option: any) {
        // Set part ID and fetch related details
        this.itemname = option.name;
        if (this.showPartNameDialogv) {
          this.itemname = option.name;
         }
        this.searchPartName = '';
        this.filteredOptionspart = this.itemOptionpart; // Reset filter options
        this.showPartNameDialog = false;
    } 

    selectItemOrProcess3(option: any) {
        // Set part ID and fetch related details
        this.processname = option.name;
        if (this.showCustomerDialog) {
          this.processname = option.name;
         }
        this.searchName = '';
        this.filteredProcessOptions = this.processOption; // Reset filter options
        this.showCustomerDialog = false;
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

      showOptionDialog1() {
        this.showCustomerDialog = true;
      }

      hideOptionDialog1(){
        this.showCustomerDialog = false;
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
    





      selectedFileName: string | null = null;

      onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
          this.selectedFile = file;
        }
      }
      
      
      uploadProgram(): void {
        if (!this.selectedFile) {
          alert('Please select a file or fill the details to upload.');
          return;
        }
      
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('custcode', this.custcode || ''); // Use the bound value or an empty string
        formData.append('fgname', this.fgname || '');
        formData.append('itemid', this.value5 || '');
        formData.append('itemname', this.itemname || '');
        formData.append('processname', this.processname || '');
        formData.append('settername', this.settername || '');
      
        this.http.post('http://192.168.16.105:3000/uploadprogrammaster', formData).subscribe({
          next: () => {
            alert('File uploaded successfully!');
            this.clearFields(); // Call the method to clear fields
          },
          error: (err) => console.error('File upload failed', err),
        });
      }
      
      clearFields(): void {
        this.selectedFile = null;
        this.selectedFileName = null;
        this.custcode = '';
        this.fgname = '';
        this.value5 = '';
        this.itemname = '';
        this.processname = '';
        this.settername = '';
      }
      
    
}
