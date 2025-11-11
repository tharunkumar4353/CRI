import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';


interface ConditionMonitoringRow {
    date: string;
    sensorMetric: string;
    reading: string;
    normalRange: string;
    status: string;
    remark: string;
    addpoint: string; 
}

interface PredictionLogRow {
    date: string;
    predictedIssue: string;
    predictionSource: string;
    confidenceLevel: string;
    predictedFailureDate: string;
    remark: string;
    addpoint: string; 
}

interface MaintenanceActionsRow {
    date: string;
    actionTaken: string;
    performedBy: string;
    basedOnPrediction: string;
    remark: string;
    addpoint: string; 
}

interface PostMaintenanceRow {
    date: string;
    issueResolved: string;
    remainingIssues: string;
    nextSteps: string;
    remark: string;
    addpoint: string; 
}

@Component({
    templateUrl: './predict.component.html'
})
export class PredictComponent implements OnInit {


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
    visibleSearchDialog: boolean = false;


    constructor(private dataService: DataService) { }

    visible1: boolean = false;
    visible2: boolean = false;
    visible3: boolean = false;
    visible4: boolean = false;

    conditionMonitoringRows: ConditionMonitoringRow[] = [{ date: '', sensorMetric: '', reading:'', normalRange: '', status: '', remark: '' , addpoint: ''  }];
    predictionLogRows: PredictionLogRow[] = [{ date: '', predictedIssue: '', predictionSource: '', confidenceLevel: '', predictedFailureDate: '', remark: '', addpoint: '' }];
    maintenanceActionsRows: MaintenanceActionsRow[] = [{ date: '', actionTaken: '', performedBy: '', basedOnPrediction: '', remark: '', addpoint: '' }];
    postMaintenanceRows: PostMaintenanceRow[] = [{ date: '', issueResolved: '', remainingIssues: '', nextSteps: '', remark: '', addpoint: '' }];

    ngOnInit(): void {
        this.dataService.getMachineNames().subscribe((names: string[]) => {
            this.machineNames = names;
            this.filteredMachineNames = names;
        });
    }
    addConditionMonitoringRow() {
        this.conditionMonitoringRows.push({ date: '', sensorMetric: '', reading: '', normalRange: '', status: '', remark: '', addpoint: '' });
    }

    addPredictionLogRow() {
        this.predictionLogRows.push({ date: '', predictedIssue: '', predictionSource: '', confidenceLevel: '', predictedFailureDate: '', remark: '', addpoint: '' });
    }

    addMaintenanceActionsRow() {
        this.maintenanceActionsRows.push({ date: '', actionTaken: '', performedBy: '', basedOnPrediction: '', remark: '', addpoint: '' });
    }

    addPostMaintenanceRow() {
        this.postMaintenanceRows.push({ date: '', issueResolved: '', remainingIssues: '', nextSteps: '', remark: '', addpoint: '' });
    }

    condition() {
        this.visible1 = true;
    }

    predictive() {
        this.visible2 = true;
    }

    maintenance() {
        this.visible3 = true;
    }

    post() {
        this.visible4 = true;
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
        // Show a confirmation dialog
        const confirmed = window.confirm('Are you sure you want to submit all the data?');
    
        if (!confirmed) {
            console.log('Submission cancelled.');
            return; // Exit if the user does not confirm
        }
    
        // Proceed with the data submission if confirmed
        const machineData = {
            machine_name: this.machine_name,
            modelNumber: this.modelNumber,
            serialNumber: this.serialNumber,
            manufacturer: this.manufacturer,
            dateOfPurchase: this.dateOfPurchase,
            dateOfInstallation: this.dateOfInstallation,
            addpoint: this.addpoint
        };
    
        this.dataService.saveMachine1Data(machineData).subscribe(
            response => {
                console.log('Machine data saved successfully:', response);
            },
            error => {
                console.error('Error saving machine data:', error);
            }
        );
    
        const conditionMonitoringData = this.conditionMonitoringRows.map(row => ({
            ...row,
            addpoint: this.addpoint 
        }));
        const predictionLogData = this.predictionLogRows.map(row => ({
            ...row,
            addpoint: this.addpoint  
        }));
        const maintenanceActionsData = this.maintenanceActionsRows.map(row => ({
            ...row,
            addpoint: this.addpoint 
        }));
        const postMaintenanceData = this.postMaintenanceRows.map(row => ({
            ...row,
            addpoint: this.addpoint 
        }));
    
        this.dataService.saveConditionMonitoringData(conditionMonitoringData).subscribe(
            response => {
                console.log('Condition monitoring data saved successfully:', response);
            },
            error => {
                console.error('Error saving condition monitoring data:', error);
            }
        );
    
        this.dataService.savePredictionLogData(predictionLogData).subscribe(
            response => {
                console.log('Prediction log data saved successfully:', response);
            }, 
            error => {
                console.error('Error saving prediction log data:', error);
            }
        );
    
        this.dataService.saveMaintenanceActionsData(maintenanceActionsData).subscribe(
            response => {
                console.log('Maintenance actions data saved successfully:', response);
            },
            error => {
                console.error('Error saving maintenance actions data:', error);
            }
        );
    
        this.dataService.savePostMaintenanceData(postMaintenanceData).subscribe(
            response => {
                console.log('Post maintenance data saved successfully:', response);
                this.resetDialogValues();
            },
            error => {
                console.error('Error saving post maintenance data:', error);
            }
        );
    }
      
resetDialogValues() {
    // Reset all the dialog row arrays to their initial state
    this.conditionMonitoringRows = [{ date: '', sensorMetric: '', reading: '', normalRange: '', status: '', remark: '', addpoint: '' }];
    this.predictionLogRows = [{ date: '', predictedIssue: '', predictionSource: '', confidenceLevel: '', predictedFailureDate: '', remark: '', addpoint: '' }];
    this.maintenanceActionsRows = [{ date: '', actionTaken: '', performedBy: '', basedOnPrediction: '', remark: '', addpoint: '' }];
    this.postMaintenanceRows = [{ date: '', issueResolved: '', remainingIssues: '', nextSteps: '', remark: '', addpoint: '' }];
    

    this.machine_name = '';
    this.modelNumber = '';
    this.serialNumber = '';
    this.manufacturer = '';
    this.dateOfPurchase = '';
    this.dateOfInstallation = '';
    this.addpoint = '';
    
}

}
