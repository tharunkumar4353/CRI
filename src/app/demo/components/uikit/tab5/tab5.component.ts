import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import { Router } from '@angular/router';

import { SocketService } from 'src/app/demo/service/socket.service';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';
interface FileInfo {
  name: string;
}
@Component({
    selector: 'tab5.component',
    templateUrl: './tab5.component.html'
})
export class Tab5Component  implements OnInit{
    emptab5:any[] = [];
    buttonState: { [partId: string]: boolean } = {}; // To track button disable state
    clickCount: { [partId: string]: number } = {};
    currentDate: Date = new Date();
    data: any[];
    partData: any[] = [];
    selectedFileName: string;
  files: FileInfo[] = [];
  fileList: FileInfo[] = [];
  selectedFileId: string | null = null;
  selectedFile: File | null = null;
  selectedFileForDownload: string | null = null;
    constructor(
      private dataService: DataService,
      private router: Router,
      private socketService: SocketService,

      private sharedDataService: SharedDataService
    ) {}
    ngOnInit(): void {
      this.dataService.getEmptab5().subscribe((result) => {
        this.data = result.map(part => ({
          ...part,
          // Disable the button if is_active is true
          isActive: part.is_active,
          buttonDisabled: part.is_active === true
        }));
        this.fetchPartDataAndMatch();
        this.loadFileList();
      });
    }
    
    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0];
    }
  
    loadFileList(): void {
      this.dataService.getFileListdemo().subscribe(
        files => this.fileList = files,
        error => console.error('Error fetching file list:', error)
      );
    }
  
    downloadFile(part: any): void {
      if (part.selectedFileId) {
        this.dataService.downloadFiledemo(part.selectedFileId).subscribe(
          response => {
            const base64Data = response.fileContent;
            const filename = response.fileName;
  
            // Convert base64 to Blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  
            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error => console.error('Error downloading file:', error)
        );
      } else {
        alert('Please select a file to download');
      }
    }
      

    fetchPartDataAndMatch() {
      this.dataService.getExcelpart().subscribe(partData => {
        this.partData = partData;
        this.data.forEach(allocation => {
          const matchedPart = this.partData.find(part => part.part_id === allocation.itemcode && part.process_id === allocation.process_id);
          allocation.program_no = matchedPart ? matchedPart.program_no : null;
        });
      }, error => {
        console.error('Error fetching part data', error);
      });
    }


    cancelProcess1(part: any) {
      // Confirm with the user before proceeding
      const confirmed = window.confirm('Are you sure you want to cancel the process?');
    
      if (confirmed) {
        // Set new data for machine 'CNC-02'
       
    
        // Request update for ID
        console.log('Requesting update for ID:', part.id);
        this.dataService.updateSubmittedStatus4(part.id).subscribe(response => {
          console.log('Status updated successfully:', response);
        }, error => {
          console.error('Error updating status:', error);
        });
    
        // Refresh the page after a successful update
        window.location.reload();
      } else {
        console.log('Process stop action was cancelled.');
      }
      if (confirmed) {
        // Set is_active to false for machine 'CNC-02' or any relevant machine
        const customId = part.custom_id;  // Ensure `custom_id` exists in `part`
        console.log('Requesting to update is_active to false for ID:', customId);
    
        // Call the service to update the `is_active` status to false (0 in SQL)
        this.dataService.updateIsActiveStatusnull(customId, false).subscribe(response => {
          console.log('Status updated successfully:', response);
    
          // Optionally reload the page after a successful update
          // window.location.reload();
        }, error => {
          console.error('Error updating status:', error);
        });
      } else {
        console.log('Process stop action was cancelled.');
      }
    }
    formatTime1(dateTime: string): string {
      const date = new Date(dateTime);
      const hours = ('0' + date.getUTCHours()).slice(-2); // Use UTC hours to avoid timezone issues
      const minutes = ('0' + date.getUTCMinutes()).slice(-2);
      
      return `${hours}:${minutes}`;
    }
    updateMachineMode(machineName: string, mode: string, partId: string, processName: string, part: any) {
      this.socketService.updateMachineMode(machineName, mode, partId, processName,).subscribe(
        response => {
          console.log('Mode update response:', JSON.stringify(response));
          this.buttonState[part.id] = true;

        },
        error => {
          console.error('Error updating machine mode:', error);
        }
      );
    }
    onStartClick(part: any): void {
  // Set is_active to true for the selected part
  this.dataService.updateIsActiveStatus(part.custom_id, true).subscribe(
    (response) => {
      console.log('is_active updated successfully:', response);

      // Disable the button for the current part
      this.buttonState[part.id] = true;
    },
    (error) => {
      console.error('Error updating is_active:', error);
    }
  );
    
        // Call the service to update start_datetime based on custom_id
  this.dataService.updateStartDateTime(part.custom_id).subscribe(
    response => {
      console.log('Start date/time updated successfully:', response);
    },
    error => {
      console.error('Error updating start date/time:', error);
    }
  );

    }
  }