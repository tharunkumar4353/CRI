import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
  templateUrl: './sumhistory.component.html',
})
export class SumhistoryComponent implements OnInit {
  maintenanceRepairLogData: any[] = [];
  incidentLogData: any[] = [];
  performanceUtilizationData: any[] = [];
  partReplacementData: any[] = [];
  scheduledMaintenanceData: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getMaintenanceRepairLog().subscribe(data => this.maintenanceRepairLogData = data);
    this.dataService.getIncidentLog().subscribe(data => this.incidentLogData = data);
    this.dataService.getPerformanceUtilization().subscribe(data => this.performanceUtilizationData = data);
    this.dataService.getPartReplacement().subscribe(data => this.partReplacementData = data);
    this.dataService.getScheduledMaintenance().subscribe(data => this.scheduledMaintenanceData = data);
  }
}
