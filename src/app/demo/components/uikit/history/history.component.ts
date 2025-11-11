import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import { HttpClient } from '@angular/common/http';

interface MaintenanceRow {
    date: string;
    activity: string;
    performedBy: string;
    remark: string;
    addpoint: string;
}

interface IncidentRow {
    date: string;
    description: string;
    reportedBy: string;
    actionTaken: string;
    addpoint: string;
}

interface PerformanceRow {
    date: string;
    metrics: string;
    remarks: string;
    addpoint: string;
}

interface PartsReplacementRow {
    date: string;
    part: string;
    replacedBy: string;
    remarks: string;
    addpoint: string;
}

interface ScheduledMaintenanceRow {
    date: string;
    task: string;
    performedBy: string;
    remarks: string;
    addpoint: string;
}

@Component({
    templateUrl: './history.component.html',

})
export class HistoryComponent implements OnInit {


    visible1: boolean = false;
    visible2: boolean = false;
    visible3: boolean = false;
    visible4: boolean = false;
    visible5: boolean = false;
    visibleSearchDialog: boolean = false;

    machine_name: string = '';
    modelNumber: string = '';
    serialNumber: string = '';
    manufacturer: string = '';
    dateOfPurchase: string = '';
    dateOfInstallation: string = '';
    addpoint: string = '';

    machineNames: string[] = [];
    filteredMachineNames: string[] = [];
    searchQuery: string = '';

    maintenanceRows: MaintenanceRow[] = [{ date: '', activity: '', performedBy: '', remark: '', addpoint: '' }];
    incidentRows: IncidentRow[] = [{ date: '', description: '', reportedBy: '', actionTaken: '', addpoint: '' }];
    performanceRows: PerformanceRow[] = [{ date: '', metrics: '', remarks: '', addpoint: '' }];
    partsReplacementRows: PartsReplacementRow[] = [{ date: '', part: '', replacedBy: '', remarks: '', addpoint: '' }];
    scheduledMaintenanceRows: ScheduledMaintenanceRow[] = [{ date: '', task: '', performedBy: '', remarks: '', addpoint: '' }];



    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.getMachineNames().subscribe((names: string[]) => {
            this.machineNames = names;
            this.filteredMachineNames = names;
        });
    }

    addMaintenanceRow() {
        this.maintenanceRows.push({ date: '', activity: '', performedBy: '', remark: '', addpoint: '' });
    }

    addIncidentRow() {
        this.incidentRows.push({ date: '', description: '', reportedBy: '', actionTaken: '', addpoint: '' });
    }

    addPerformanceRow() {
        this.performanceRows.push({ date: '', metrics: '', remarks: '', addpoint: '' });
    }

    addPartsReplacementRow() {
        this.partsReplacementRows.push({ date: '', part: '', replacedBy: '', remarks: '', addpoint: '' });
    }

    addScheduledMaintenanceRow() {
        this.scheduledMaintenanceRows.push({ date: '', task: '', performedBy: '', remarks: '', addpoint: '' });
    }

    maintenance() {
        this.visible1 = true;
    }

    incident() {
        this.visible2 = true;
    }

    performance() {
        this.visible3 = true;
    }

    part() {
        this.visible4 = true;
    }

    scheduled() {
        this.visible5 = true;
    }

    openSearchDialog() {
        this.visibleSearchDialog = true;
    }

    closeSearchDialog() {
        this.visibleSearchDialog = false;
    }

    performSearch(query: string) {
        this.searchQuery = query;
        this.filteredMachineNames = this.machineNames.filter(name => name.toLowerCase().includes(query.toLowerCase()));
    }
    selectMachineName(name: string) {
        this.machine_name = name;
        this.closeSearchDialog();
        this.dataService.getMachineNameDetails(name).subscribe(
            data => {
                this.modelNumber = data.modelnumber;
                this.serialNumber = data.serialnumber;
                this.manufacturer = data.manufacturer;
                this.dateOfInstallation = data.dateofinstallation;

            },
            error => {
                console.error('Error fetching item details:', error);
            }
        );
    }

    submitData() {
        // Confirm with the user before proceeding
        const confirmed = window.confirm('Are you sure you want to submit all the data?');
      
        if (confirmed) {
          const machineData1 = {
            machine_name: this.machine_name,
            modelNumber: this.modelNumber,
            serialNumber: this.serialNumber,
            manufacturer: this.manufacturer,
            dateOfPurchase: this.dateOfPurchase,
            dateOfInstallation: this.dateOfInstallation,
            addpoint: this.addpoint
          };
      
          this.dataService.saveMachineData(machineData1).subscribe(
            response => {
              console.log('Data saved successfully:', response);
            },
            error => {
              console.error('Error saving data:', error);
            }
          );
      
          const maintenanceData = this.maintenanceRows.map(row => ({
            ...row,
            addpoint: this.addpoint
          }));
          this.dataService.saveMaintenanceData(maintenanceData).subscribe(
            response => {
              console.log('Maintenance data saved successfully:', response);
            },
            error => {
              console.error('Error saving maintenance data:', error);
            }
          );
      
          const incidentData = this.incidentRows.map(row => ({
            ...row,
            addpoint: this.addpoint
          }));
          this.dataService.saveIncidentData(incidentData).subscribe(
            response => {
              console.log('Incident data saved successfully:', response);
            },
            error => {
              console.error('Error saving incident data:', error);
            }
          );
      
          const performanceData = this.performanceRows.map(row => ({
            ...row,
            addpoint: this.addpoint
          }));
          const partsReplacementData = this.partsReplacementRows.map(row => ({
            ...row,
            addpoint: this.addpoint
          }));
          const scheduledMaintenanceData = this.scheduledMaintenanceRows.map(row => ({
            ...row,
            addpoint: this.addpoint
          }));
          this.dataService.savePerformanceData(performanceData).subscribe(
            response => {
              console.log('Performance data saved successfully:', response);
            },
            error => {
              console.error('Error saving performance data:', error);
            }
          );
      
          this.dataService.savePartsReplacementData(partsReplacementData).subscribe(
            response => {
              console.log('Parts replacement data saved successfully:', response);
            },
            error => {
              console.error('Error saving parts replacement data:', error);
            }
          );
      
          this.dataService.saveScheduledMaintenanceData(scheduledMaintenanceData).subscribe(
            response => {
              console.log('Scheduled maintenance data saved successfully:', response);
            },
            error => {
              console.error('Error saving scheduled maintenance data:', error);
            }
          );
      
          // Optionally, reset all values after successful submission
          this.resetAllValues();
        } else {
          console.log('Submission cancelled.');
        }
      }
          resetAllValues() {
        
        this.maintenanceRows = [{ date: '', activity: '', performedBy: '', remark: '', addpoint: '' }];
        this.incidentRows = [{ date: '', description: '', reportedBy: '', actionTaken: '', addpoint: '' }];
        this.performanceRows = [{ date: '', metrics: '', remarks: '', addpoint: '' }];
        this.partsReplacementRows = [{ date: '', part: '', replacedBy: '', remarks: '', addpoint: '' }];
        this.scheduledMaintenanceRows = [{ date: '', task: '', performedBy: '', remarks: '', addpoint: '' }];

        
        this.machine_name = '';
        this.modelNumber = '';
        this.serialNumber = '';
        this.manufacturer = '';
        this.dateOfPurchase = '';
        this.dateOfInstallation = '';
        this.addpoint = '';

    }
}


