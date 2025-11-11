import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
  templateUrl: './qualitydemo.component.html',
})
export class QualityDemoComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  data: any[] = [];
  machineDataSubscription: Subscription;
  process: any[];

  constructor(private sharedDataService: SharedDataService, private dataService: DataService) {}

  ngOnInit() {
    this.fetchQualityData();

    this.dataService.getSummaryqualityDatatoday().subscribe(
      data => {
        this.process = data;
      },
      error => {
        console.error('Error fetching summary data', error);
      }
    );

  }
  fetchQualityData() {
    this.dataService.getData().subscribe(
      (result) => {
        this.data = result;
        console.log('Data fetched successfully:', this.data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.machineDataSubscription) {
      this.machineDataSubscription.unsubscribe();
    }
  }

  submitQualityData(item: any) {
    // Check if all required fields are filled

    // Confirm submission with the user
    const confirmSubmission = window.confirm('Are you sure you want to submit this data?');
  
    if (!confirmSubmission) {
      return; // Exit the function if the user clicks "Cancel"
    }
  
    // Prepare the data to be inserted into the database
    const dataToInsert = {
      unique_id: item.custom_id,
      machine_name: item.machineno,
      work_order: item.work_order,

      cust_code:item.cust_code,
      fg_name: item.fg_name,
      itemprocess_id: item.itemprocess_id,

      part_id: item.itemcode,
      part_name: item.itemname,
      process_name: item.process_name,
      planned_quantity: item.planquantity,
      setter_name: item.settername,
      operator_name: item.operatorname,
      accept: item.acceptedCount,
      reject: item.rejection,
      rework: item.rework,
      reason: item.reason,
      id: item.id  // Make sure you include the id field
    };
  
    this.dataService.sendQualityData(dataToInsert).subscribe(
      (response) => {
        console.log('Data inserted successfully:', response);
        this.data = this.data.filter(d => d.itemcode !== item.itemcode);
      },
      (error) => {
        console.error('Error inserting data:', error);
      }
    );
  
    // Optionally, refresh the page or update the view
    window.location.reload(); // Consider removing this if you handle updates in the UI
  }
  
}