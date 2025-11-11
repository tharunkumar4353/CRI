import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';
import { SocketService } from 'src/app/demo/service/socket.service';
import { DataService } from 'src/app/demo/service/data.service';
@Component({
    selector: 'cycle4.component',
    templateUrl: './cycle4.component.html'
})
export class Cycle4Component implements OnInit {

    
  uniqid: any;
  partName: string;
  partId: string;
  planquantity: number;
  Date: Date;
  cycle:any;
  programNo: number;
  setterName: string;
  processName: string;
  machinename: string;
  operatorName: string;
  processType: string;
  cnc05Data: any = {}; // To store data specifically for CNC-02
  id: any;
  custcode: any;
  fgname: any;
  customid: any;
  empAcceptCount: number; // Store employee accepted count
    constructor(
      private dataService: DataService,
      private socketService: SocketService,

        private location: Location,private route: ActivatedRoute,
        private sharedDataService: SharedDataService

      ) {}
 
      ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
          this.partName = params['partName'];
          this.planquantity = +params['planquantity'];
          this.uniqid = params['uniqid'];
          this.cycle = params['cycle'];
          this.customid = params['customid'];

          this.partId = params['partId'];
          this.Date = params['Date'];
          this.programNo = +params['programNo'];
          this.setterName = params['setterName'];
          this.operatorName = params['operatorName'];  // Operator Name
          this.processType = params['processType'];    // Process Type
          this.processName = params['processName'];
          this.machinename = params['machinename'] || 'CNC-05';
          this.custcode = params['custcode'];
          this.fgname = params['fgname'];
    
          console.log('unique id:', this.uniqid);
          console.log('cycle time planned:', this.cycle);
    
          console.log('Part Name:', this.partName);
          console.log('Setter Name:', this.setterName);
          console.log('Operator Name:', this.operatorName);
          console.log('Process Type:', this.processType);
          console.log('Process Name:', this.processName);
          console.log('custcode :', this.custcode);
          console.log('fg Name:', this.fgname);
          console.log('Machine Name:', this.machinename);
    
          // Updating the shared data service
          this.sharedDataService.setMachineData(
            this.machinename,     // machineName
            this.partId,          // partId
            this.partName,        // partName
            this.setterName,      // setterName
            this.processName,     // processName
            this.planquantity,    // quantity
            this.processType,     // processType
            this.operatorName,     // operatorName
            this.custcode,
            this.fgname
          );
        });

      // Listening to real-time data from socket
      this.socketService.getLiveData().subscribe((data: any) => {
        const parsedData = JSON.parse(data);
        this.filterMachineData(parsedData);
        console.log('Real-time CNC-05 data:', this.cnc05Data);
      });
  
  
      }

      
      visible: boolean = false;

      showDialog() {
          this.visible = true;
      }
    
      saveEmpAcceptCount(customid: string) {
        if (!this.empAcceptCount || !customid) {
          console.error('Employee accept count or custom ID is missing');
          return;
        }
      
        // Call the service to update emp_accept_count in the database
        this.dataService.updateEmployeeAcceptCount(customid, this.empAcceptCount).subscribe(
          response => {
            console.log('Employee accept count updated successfully:', response);
            // Optionally, you can refresh the page or update the view here
          },
          error => {
            console.error('Error updating employee accept count:', error);
          }
        );
      }  
        // Filter the data to get CNC-02 specific data
    filterMachineData(data: { [key: string]: any }) {
      if (data['CNC-05']) {
        this.cnc05Data = data['CNC-05'];
      }
    }
  
    // Format time in seconds to readable format
    formatTime(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(secs)}`;
    }
  
    // Pad number to two digits
    padNumber(num: number): string {
      return num.toString().padStart(2, '0');
    }
  
    goBack() {
      this.location.back();
    }
    stopAndUpdateMachineMode4(machineName: string, processType: string, partId: string, processName: string, uniqid: any) {
      // Confirm with the user before proceeding
      const confirmed = window.confirm('Are you sure you want to stop the process?');
      
      if (confirmed) {
        // Determine the mode based on processType
        let mode = processType === 'Setting' ? 'setting stop' : 'production stop'; 
    
        // 1. Update the machine mode
        this.socketService.updateMachineMode(machineName, mode, partId, processName).subscribe(
          response => {
            console.log('Mode update response:', JSON.stringify(response));
          },
          error => {
            console.error('Error updating machine mode:', error);
          }
        );
    
        // 2. Update the submitted status for the specific uniqid
        console.log('Requesting update for ID:', uniqid);
        this.dataService.updateSubmittedStatus(uniqid).subscribe(response => {
          console.log('Status updated successfully:', response);
          
          // Optionally refresh the page after the update (not usually recommended to refresh the page)
          window.location.reload();
          this.location.back();
        }, error => {
          console.error('Error updating status:', error);
        });
        
      } else {
        console.log('Process stop action was cancelled.');
      }
    }
    
  }
  
  