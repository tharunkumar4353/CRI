import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
  templateUrl: './suminstall.component.html',
})
export class SuminstallComponent implements OnInit {
  machineData: any[] = [];
  warrantySupportData: any[] = [];
  trainingDocumentationData: any[] = [];
  maintenanceScheduleData: any[] = [];
  initialTestingCalibrationData: any[] = [];
  safetyComplianceData: any[] = [];
  machineSpecificationsData: any[] = [];
  installationDetailData: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.fetchMachineData();
    this.fetchWarrantySupportData();
    this.fetchTrainingDocumentationData();
    this.fetchMaintenanceScheduleData();
    this.fetchInitialTestingCalibrationData();
    this.fetchSafetyComplianceData();
    this.fetchMachineSpecificationsData();
    this.fetchInstallationDetailData();
  }

  fetchMachineData() {
    this.dataService.getMachineDatasum().subscribe(
      data => { this.machineData = data; },
      error => { console.error('Error fetching machine data:', error); }
    );
  }

  fetchWarrantySupportData() {
    this.dataService.getWarrantySupportData().subscribe(
      data => { this.warrantySupportData = data; },
      error => { console.error('Error fetching warranty support data:', error); }
    );
  }

  fetchTrainingDocumentationData() {
    this.dataService.getTrainingDocumentationData().subscribe(
      data => { this.trainingDocumentationData = data; },
      error => { console.error('Error fetching training documentation data:', error); }
    );
  }

  fetchMaintenanceScheduleData() {
    this.dataService.getMaintenanceScheduleData().subscribe(
      data => { this.maintenanceScheduleData = data; },
      error => { console.error('Error fetching maintenance schedule data:', error); }
    );
  }

  fetchInitialTestingCalibrationData() {
    this.dataService.getInitialTestingCalibrationData().subscribe(
      data => { this.initialTestingCalibrationData = data; },
      error => { console.error('Error fetching initial testing calibration data:', error); }
    );
  }

  fetchSafetyComplianceData() {
    this.dataService.getSafetyComplianceData().subscribe(
      data => { this.safetyComplianceData = data; },
      error => { console.error('Error fetching safety compliance data:', error); }
    );
  }

  fetchMachineSpecificationsData() {
    this.dataService.getMachineSpecificationsData().subscribe(
      data => { this.machineSpecificationsData = data; },
      error => { console.error('Error fetching machine specifications data:', error); }
    );
  }

  fetchInstallationDetailData() {
    this.dataService.getInstallationDetailData().subscribe(
      data => { this.installationDetailData = data; },
      error => { console.error('Error fetching installation detail data:', error); }
    );
  }
}
