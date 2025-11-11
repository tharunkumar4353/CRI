import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { SocketService } from 'src/app/demo/service/socket.service';
import { SharedDataService } from 'src/app/demo/service/shared-data.service';
import { DataService } from 'src/app/demo/service/data.service';
import { Subscription } from 'rxjs';
// Define the mapping for machine names
const machineNameMapping: { [key: string]: string } = {
  'CNC 001': 'CNC-01',
  'CNC 002': 'CNC-02',
  'CNC 003': 'CNC-03',
  'CNC 004': 'CNC-04',
  'CNC 005': 'CNC-05',
  'VMC 001': 'VMC-01',
  'VMC 002': 'VMC-02'
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  machineData: { [key: string]: any } = {};
  oeeData: { [key: string]: number } = {}; 
  machines = [ 'CNC-02', 'CNC-03', 'CNC-04', 'CNC-05', 'VMC-01', 'VMC-02'];
  
  private machineDataSubscription: Subscription;
  private oeeDataSubscription: Subscription;
  private socketDataSubscription: Subscription;
  private dataInterval: any; // To store the interval reference
  machineData1: { [key: string]: any } = {};
  previousPartCounts: { [key: string]: number } = {};
  private oeeInterval: any; // To store the interval reference


  constructor(
    private socketService: SocketService,
    private sharedDataService: SharedDataService,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Subscribe to SharedDataService to get machine data
    this.machineDataSubscription = this.sharedDataService.machineData$.subscribe(data => {
      this.machineData = data;
      console.log('Updated machine data:', this.machineData);
      this.cdr.detectChanges();
      
    });
  
    // Subscription for real-time machine data from socket
    this.socketDataSubscription = this.socketService.getLiveData().subscribe((data: any) => {
      const parsedData = JSON.parse(data);
      // Merge new data with existing shared data
      this.machineData1 = { ...this.machineData1, ...parsedData };
      console.log('Real-time machine data:', this.machineData1);
      this.cdr.detectChanges();
    });
    this.oeeDataSubscription = this.dataService.getOee().subscribe((data: any[]) => {
      console.log('Fetched OEE data:', data);
      this.oeeData = this.processData(data);
      this.cdr.detectChanges();
    });
   

        
    // Listen for real-time machine data
    this.socketService.getLiveData().subscribe((data: any) => {
      const parsedData = JSON.parse(data);
      
      // Detect part count increments and send to the backend
      for (const machineName in parsedData) {
        const currentMachine = parsedData[machineName];

        // Check if the part count has incremented
        if (
          this.previousPartCounts[machineName] !== undefined &&
          currentMachine.part_count > this.previousPartCounts[machineName]
        ) {
          // Part count incremented, send the data to the backend
          this.insertMachineDatacycle({ [machineName]: currentMachine });
        }

        // Update the previous part count
        this.previousPartCounts[machineName] = currentMachine.part_count;
      }

      // Update machine data
      this.machineData1 = { ...this.machineData1, ...parsedData };
    });
    

    // Start the interval to send data every minute
    this.startDataInterval();
    this.startOEEInterval();
  }

  ngOnDestroy(): void {
    this.machineDataSubscription?.unsubscribe();
    this.oeeDataSubscription?.unsubscribe();
    this.socketDataSubscription?.unsubscribe();

    // Clear the interval when the component is destroyed
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }

  startDataInterval() {
    // Function to send data every minute
    this.dataInterval = setInterval(() => {
      this.insertMachineData(this.machineData1);
      this.insertoeepart1Data(this.machineData1);

      this.insertPartGraphData(this.machineData1);

    }, 60000); // 60000 ms = 1 minute

  }

  startOEEInterval() {
    this.oeeInterval = setInterval(() => {
      const currentTime = new Date();
      if (currentTime.getHours() === 11 && currentTime.getMinutes() === 20) {
        this.insertOEEData();
      }
    }, 60000); // check every minute if it's the right time
  }


  insertOEEData() {
    Object.keys(this.oeeData).forEach(machineName => {
      const oeePercent = this.oeeData[machineName] !== undefined ? this.oeeData[machineName] : 0;
      const dataToInsert = {
        machinename: machineName,
        date: new Date(), // Insert current date
        oee_percent: oeePercent
      };
      this.dataService.insertOEEData(dataToInsert).subscribe(
        response => console.log('OEE data inserted successfully:', response),
        error => console.error('Error inserting OEE data:', error)
      );
    });
  }

  insertoeepart1Data(machineData1: any) {
    const dataToSend = Object.keys(machineData1).map(machineName => {
      const formattedMachineName = this.formatMachineName(machineName);
      const machine = machineData1[machineName];
      return {
        machine_name: formattedMachineName,
        run_time: this.convertToMinutes(machine.timers.runtime),
        planned_production_time: 480  // Set planned_production_time to 480
      };
    });
  
    dataToSend.forEach(data => {
      this.dataService.sendoeepart1Data(data).subscribe(
        (response) => console.log('Data inserted successfully:', response),
        (error) => console.error('Error inserting data:', error)
      );
    });
  }
  
  // Helper function to format machine names
  formatMachineName(machineName: string): string {
    switch (machineName) {
      case 'CNC-01': return 'CNC 001';
      case 'CNC-02': return 'CNC 002';
      case 'CNC-03': return 'CNC 003';
      case 'CNC-04': return 'CNC 004';
      case 'CNC-05': return 'CNC 005';
      case 'VMC-01': return 'VMC 001';
      case 'VMC-02': return 'VMC 002';
      default: return machineName; // Return the original name if it doesn't match
    }
  }
  

  insertMachineData(machineData1: any) {
    const dataToSend = Object.keys(machineData1).map(machineName => {
      const machine = machineData1[machineName];
      return {
        machine_name: machineName,
        run_time: this.convertToMinutes(machine.timers.runtime),
        process_idle: this.convertToMinutes(machine.timers.process_idle),
        machine_idle: this.convertToMinutes(machine.timers.idle),
        breakdown: this.convertToMinutes(machine.timers.breakdown),
        cycle_time: this.convertToMinutes(machine.cycle_time)

      };
    });
  
    dataToSend.forEach(data => {
      this.dataService.sendMachineData(data).subscribe(
        (response) => console.log('Data inserted successfully:', response),
        (error) => console.error('Error inserting data:', error)
      );
    });
  }

  insertPartGraphData(machineData1: any) {
    const dataToSend = Object.keys(machineData1).map(machineName => {
      const machine = machineData1[machineName];
      const plannedQuantity = this.machineData[machineName]?.quantity || 0; // Default to 0 if N/A
  
      return {
        machine_name: machineName,
        actual_partcount: Number(machine.part_count) || 0, // Ensure it's a number
        planned_partcount: Number(plannedQuantity) || 0 // Ensure it's a number
      };
    });
  
    dataToSend.forEach(data => {
      this.dataService.sendPartGraphData(data).subscribe(
        (response) => console.log('Part Graph Data inserted successfully:', response),
        (error) => console.error('Error inserting part graph data:', error)
      );
    });
  }
  
  
  
  convertToMinutes(seconds: number): number {
    return seconds / 60;
  }
  
  processData(data: any[]): { [key: string]: number } {
    const results: { [key: string]: number } = {};
    
    data.forEach((item) => {
      const machineName = machineNameMapping[item.machine_name] || item.machine_name; // Map to desired format
      const runtime = parseFloat(item.runtime) || 0;
      const planned_production_time = parseFloat(item.planned_production_time) || 0;
      const total_actual_qty = parseFloat(item.total_actual_qty) || 0;
      const total_planned_qty = parseFloat(item.total_planned_qty) || 0;
      const good_units = parseFloat(item.good_units) || 0;
    
      if (runtime > 0 && planned_production_time > 0 && total_actual_qty > 0 && total_planned_qty > 0 && good_units > 0) {
        // Calculate Availability, Performance, and Quality
        const availability = runtime / planned_production_time;
        const performance = total_actual_qty / total_planned_qty;
        const quality = good_units / total_actual_qty;
        
        // Calculate OEE result
        const oee = (availability * performance * quality) * 100;
        
        // Store the result for the mapped machine name
        results[machineName] = oee;
      }
    });
  
    return results;
  }
  
  

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(secs)}`;
  }
  
  padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
  

  getPowerStatus(color: string | null): string {
    return color ? 'Power On' : 'Power Off';
  }

  insertMachineDatacycle(machineData: any): void {
    this.dataService.sendactualcycle(machineData).subscribe(
      (response) => {
        console.log('Machine data inserted successfully:', response);
      },
      (error) => {
        console.error('Error inserting machine data:', error);
      }
    );
  }
}
