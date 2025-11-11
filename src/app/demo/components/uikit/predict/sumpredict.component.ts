import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
  templateUrl: './sumpredict.component.html',
})
export class SumpredictComponent implements OnInit {
  conditionMonitoringData: any[] = [];
  predictionLogData: any[] = [];
  maintenanceActionTakenData: any[] = [];
  postMaintenanceAnalysisData: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getConditionMonitoringData().subscribe(data => this.conditionMonitoringData = data);
    this.dataService.getPredictionLogData().subscribe(data => this.predictionLogData = data);
    this.dataService.getMaintenanceActionTakenData().subscribe(data => this.maintenanceActionTakenData = data);
    this.dataService.getPostMaintenanceAnalysisData().subscribe(data => this.postMaintenanceAnalysisData = data);
  }
}
