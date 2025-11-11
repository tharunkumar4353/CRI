import { Component } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import { DatePipe } from '@angular/common';



@Component({
    templateUrl: './install.component.html'
})
export class InstallComponent {

    visible1: boolean = false;
    visible2: boolean = false;
    visible3: boolean = false;
    visible4: boolean = false;
    visible5: boolean = false;
    visible6: boolean = false;
    visible7: boolean = false;
    visible8: boolean = false;
    visible9: boolean = false;

    report: any;
    approve: any;
    addpoint: any;
    

    // General Info
    machinename: string = ''; 
    modelnumber: string;
    serialnumber: string;
    manufactor: string;
    dateinstall: string;
    generalInfo: any;

    // Installation Details
    location: string;
    installedBy: string;
    installationSupervisor: string;
    installationMethod: string;
    installationDetails: any;

    // Machine Specification
    powerRequirement: string;
    dimension: string;
    weight: string;
    operationalCapacity: string;
    machineSpecification: any;

    // Safety Compliance
    safetyFeatures: string;
    complianceStandards: string;
    safetyInspectionsConducted: string;
    inspectionDate: any;
    safetyCompliance: any;

    // Initial Testing Calibration
    testConducted: string;
    testResults: string;
    calibrationDetails: string;
    calibratedBy: string;
    initialTestingCalibration: any;

    // Maintenance Schedule
    firstMaintenanceDate: any;
    routineMaintenanceFrequency: string;
    nextScheduledMaintenance: any;
    maintenanceSchedule: any;

    // Training and Documentation
    trainingProvided: string;
    trainingDate: any;
    trainerName: string;
    documentationProvided: string;
    userManuals: string;
    trainingAndDocumentation: any;

    // Warranty and Support
    warrantyPeriod: string;
    warrantyStartDate: any;
    warrantyEndDate: any;
    supportContactInformation: string;
    warrantyAndSupport: any;


    selectMachine(machine: string) {
        this.machinename = machine;
        this.visible9 = false; 
        
    }
    constructor(private dataService: DataService,private datePipe: DatePipe) { }
    general() {
        this.visible1 = true;
    }
    install() {
        this.visible2 = true;
    }
    machine() {
        this.visible3 = true;
    }

    safety() {
        this.visible4 = true;
    }

    initial() {
        this.visible5 = true;
    }

    schedule() {
        this.visible6 = true;
    }

    training() {
        this.visible7 = true;
    }

    warranty() {
        this.visible8 = true;
    }

    saveGeneralInfo() {
        this.generalInfo = {
            machinename: this.machinename,
            modelnumber: this.modelnumber,
            serialnumber: this.serialnumber,
            manufactor: this.manufactor,
            dateinstall: this.dateinstall,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible1 = false;
    }
    openMachineDetailsDialog() {
        this.visible9 = true; 
    }
    
    saveInstallationDetails() {
        this.installationDetails = {
            location: this.location,
            installedBy: this.installedBy,
            installationSupervisor: this.installationSupervisor,
            installationMethod: this.installationMethod,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible2 = false;
    }

    saveMachineSpecification() {
        this.machineSpecification = {
            powerRequirement: this.powerRequirement,
            dimension: this.dimension,
            weight: this.weight,
            operationalCapacity: this.operationalCapacity,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible3 = false;
    }

    saveSafetyCompliance() {
        this.safetyCompliance = {
            safetyFeatures: this.safetyFeatures,
            complianceStandards: this.complianceStandards,
            safetyInspectionsConducted: this.safetyInspectionsConducted,
            inspectionDate: this.inspectionDate,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible4 = false;
    }

    saveInitialTestingCalibration() {
        this.initialTestingCalibration = {
            testConducted: this.testConducted,
            testResults: this.testResults,
            calibrationDetails: this.calibrationDetails,
            calibratedBy: this.calibratedBy,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible5 = false;
    }

    saveMaintenanceSchedule() {
        this.maintenanceSchedule = {
            firstMaintenanceDate: this.firstMaintenanceDate,
            routineMaintenanceFrequency: this.routineMaintenanceFrequency,
            nextScheduledMaintenance: this.nextScheduledMaintenance,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible6 = false;
    }

    saveTrainingAndDocumentation() {
        this.trainingAndDocumentation = {
            trainingProvided: this.trainingProvided,
            trainingDate: this.trainingDate,
            trainerName: this.trainerName,
            documentationProvided: this.documentationProvided,
            userManuals: this.userManuals,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible7 = false;
    }

    saveWarrantyAndSupport() {
        this.warrantyAndSupport = {
            warrantyPeriod: this.warrantyPeriod,
            warrantyStartDate: this.warrantyStartDate,
            warrantyEndDate: this.warrantyEndDate,
            supportContactInformation: this.supportContactInformation,
            addpoint: this.addpoint,
            report: this.report,
            approve: this.approve
        };
        this.visible8 = false;
    }
    clearFormData() {
        this.machinename = '';
        this.modelnumber = '';
        this.serialnumber = '';
        this.manufactor = '';
        this.dateinstall = '';
        this.location = '';
        this.installedBy = '';
        this.installationSupervisor = '';
        this.installationMethod = '';
        this.powerRequirement = '';
        this.dimension = '';
        this.weight = '';
        this.operationalCapacity = '';
        this.safetyFeatures = '';
        this.complianceStandards = '';
        this.safetyInspectionsConducted = '';
        this.inspectionDate = null;
        this.testConducted = '';
        this.testResults = '';
        this.calibrationDetails = '';
        this.calibratedBy = '';
        this.firstMaintenanceDate = null;
        this.routineMaintenanceFrequency = '';
        this.nextScheduledMaintenance = null;
        this.trainingProvided = '';
        this.trainingDate = null;
        this.trainerName = '';
        this.documentationProvided = '';
        this.userManuals = '';
        this.warrantyPeriod = '';
        this.warrantyStartDate = null;
        this.warrantyEndDate = null;
        this.supportContactInformation = '';
        this.addpoint = '';
        this.approve = '';
        this.report = '';
    }

    submitAll() {
        // Confirm with the user before proceeding
        const confirmed = window.confirm('Are you sure you want to submit all the data?');
    
        if (confirmed) {
            this.saveGeneralInfo();
            this.dataService.saveGeneralInfo(this.generalInfo).subscribe(response => {
                console.log('General Information saved:', response);
            });
    
            this.saveInstallationDetails();
            this.dataService.saveInstallationDetails(this.installationDetails).subscribe(response => {
                console.log('Installation Details saved:', response);
            });
    
            this.saveMachineSpecification();
            this.dataService.saveMachineSpecification(this.machineSpecification).subscribe(response => {
                console.log('Machine Specification saved:', response);
            });
    
            this.saveSafetyCompliance();
            this.dataService.saveSafetyCompliance(this.safetyCompliance).subscribe(response => {
                console.log('Safety Compliance saved:', response);
            });
    
            this.saveInitialTestingCalibration();
            this.dataService.saveInitialTestingCalibration(this.initialTestingCalibration).subscribe(response => {
                console.log('Initial Testing Calibration saved:', response);
            });
    
            this.saveMaintenanceSchedule();
            this.dataService.saveMaintenanceSchedule(this.maintenanceSchedule).subscribe(response => {
                console.log('Maintenance Schedule saved:', response);
            });
    
            this.saveTrainingAndDocumentation();
            this.dataService.saveTrainingAndDocumentation(this.trainingAndDocumentation).subscribe(response => {
                console.log('Training and Documentation saved:', response);
            });
    
            this.saveWarrantyAndSupport();
            this.dataService.saveWarrantyAndSupport(this.warrantyAndSupport).subscribe(response => {
                console.log('Warranty and Support saved:', response);
                this.clearFormData();
            });
    
        } else {
            console.log('Submission cancelled.');
        }
    }
    
}
