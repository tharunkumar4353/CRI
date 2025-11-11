import { Component, OnInit, OnDestroy } from '@angular/core';
import { CountryService } from 'src/app/demo/service/country.service';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { DataService } from '../../service/data.service';
//table
import { ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

//chart
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HttpClient } from '@angular/common/http';


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './furnace.component.html',
    providers: [MessageService, ConfirmationService]
})


export class FurnaceComponent implements OnInit {
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
    process: any[] = [];
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


    isEditMode = false;
    selectedRow: any = null;
    uploadedFile: File | null = null;
date: any;

    constructor(private dataService: DataService, private http: HttpClient) { }

    ngOnInit() {

        this.dataService.getProgrammaster().subscribe(
            (data) => {
                this.process = data;
                console.log('Filtered data:', data);
            },
            (error) => {
                console.error('Error fetching data:', error);
            }
        );

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

    extractFileName(filePath: string | null | undefined): string {
        if (!filePath) {
            return 'No File'; // Return a default value or handle as needed
        }
        return filePath.split('\\').pop() || filePath.split('/').pop() || filePath.split('-').pop() || filePath;
    }

    //   extractFileName(filePath: string): string {
    //     // Use regex to extract the file name part after the last hyphen or split the string
    //     const fileName = filePath.split('-').pop();  // Extract the part after the last '-'
    //     return fileName ? fileName : '';  // Return the file name if it exists, otherwise return an empty string
    //   }


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
        this.itemid = option.name;
        if (this.showItemDialog) {
            this.itemid = option.name;
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

    hideOptionDialog1() {
        this.showCustomerDialog = false;
    }


    filtercustcode() {
        if (this.searchcustcode) {
            this.filteredcustcodeOptions = this.custcodeOption.filter(emp => (emp.name ? emp.name.toLowerCase() : '').includes(this.searchcustcode.toLowerCase()));
        } else {
            this.filteredcustcodeOptions = this.custcodeOption;
        }
    }

    filterfgname() {
        if (this.searchfgname) {
            this.filteredfgnameOptions = this.fgnameOption.filter(emp => (emp.name ? emp.name.toLowerCase() : '').includes(this.searchfgname.toLowerCase()));
        } else {
            this.filteredfgnameOptions = this.fgnameOption;
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



    downloadProgram(): void {
        // Validate required fields
        if (!this.custcode || !this.fgname || !this.itemid || !this.itemname || !this.processname) {
            alert('Please fill in all the required fields before downloading.');
            return;
        }

        const queryParams = {
            custcode: this.custcode,
            fgname: this.fgname,
            itemid: this.itemid,
            itemname: this.itemname,
            processname: this.processname
        };

        this.http.get('http://192.168.16.105:3000/downloadprogrammaster', {
            params: queryParams,
            responseType: 'blob' // Important for downloading files
        }).subscribe({
            next: (response) => {
                const blob = new Blob([response], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Program_${queryParams.custcode}_${queryParams.fgname}.txt`; // Customize the file name
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('File download failed', err);
                alert('Error downloading the file or there is no program related to the entered details.');
            }
        });
    }


    downloadFile(id: number, fileName: string): void {
        this.dataService.downloadFileprogram(id).subscribe(
            (data: Blob) => {
                const blob = new Blob([data], { type: 'application/octet-stream' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName; // Use the extracted file name
                link.click();
                window.URL.revokeObjectURL(link.href);
            },
            (error) => {
                console.error('Error downloading file:', error);
            }
        );
    }


    searchData(): void {
        const filters: any = {};
        if (this.date) {
          // Convert to 'YYYY-MM-DD' format
          const formattedDate = this.date ? this.formatDate(this.date) : null;
          filters.date = formattedDate;
        }
        if (this.custcode) filters.custCode = this.custcode;
        if (this.fgname) filters.fgName = this.fgname;
        if (this.itemid) filters.itemId = this.itemid;
        if (this.itemname) filters.itemName = this.itemname;
        if (this.processname) filters.processName = this.processname;
      
        this.dataService.getFilteredDataprogram(filters).subscribe(
          (data) => {
            this.process = data; // Update the table data
          },
          (error) => {
            console.error('Error fetching filtered data:', error);
          }
        );
      }
      
      // Helper function to format the date to 'YYYY-MM-DD'
      formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero for months
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero for days
        return `${year}-${month}-${day}`;
      }
      

    resetFields(): void {
        this.custcode = '';
        this.fgname = '';
        this.itemid = '';
        this.itemname = '';
        this.processname = '';

        // Fetch all data or reset the table to its initial state
        this.dataService.getFilteredDataprogram({}).subscribe(
            (data) => {
                this.process = data; // Reset the table data
            },
            (error) => {
                console.error('Error resetting data:', error);
            }
        );
    }

    editRow(part: any): void {
        this.isEditMode = true;
        this.selectedRow = { ...part }; // Create a copy of the row to edit
        this.uploadedFile = null; // Reset uploaded file
    }
    handleFileInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.uploadedFile = input.files[0]; // Store the selected file
        }
    }

    saveRow(): void {
        if (this.selectedRow) {
            const formData = new FormData();
            formData.append('date', this.selectedRow.date);
            formData.append('CustomerCode', this.selectedRow.CustomerCode);
            formData.append('FGName', this.selectedRow.FGName);
            formData.append('ItemID', this.selectedRow.ItemID);
            formData.append('ItemName', this.selectedRow.ItemName);
            formData.append('ProcessName', this.selectedRow.ProcessName);
            formData.append('SetterName', this.selectedRow.SetterName);
    
            // Check if a new file was uploaded
            if (this.uploadedFile) {
                formData.append('File', this.uploadedFile, this.uploadedFile.name);
            } else {
                // Do not send FilePath or FileContent if no changes were made
                formData.append('FilePath', this.selectedRow.FilePath || '');
            }
    
            this.dataService.updateRowprogram(formData, this.selectedRow.ID).subscribe(
                (response) => {
                    console.log('Row updated successfully:', response);
                    this.isEditMode = false;
                    this.selectedRow = null;
                    this.uploadedFile = null; // Reset the uploaded file
                    this.fetchData(); // Refresh table data
                },
                (error) => {
                    console.error('Error updating row:', error);
                }
            );
        }
    }
    
    
    



    deleteRow(id: number): void {
        if (confirm('Are you sure you want to delete this row?')) {
            this.dataService.deleteRowprogram(id).subscribe(
                () => {
                    this.fetchData(); // Refresh table after deletion
                },
                (error) => {
                    console.error('Error deleting row:', error);
                }
            );
        }
    }



    fetchData(): void {
        this.dataService.getFilteredDataprogram({}).subscribe(
            (data) => {
                this.process = data;
            },
            (error) => {
                console.error('Error fetching data:', error);
            }
        );
    }


}
