import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface MachineData {
  partId: string;
  partName: string;
  setterName: string;
  processName: string;
  planquantity: number;
  processType: string;      // Added processType
  operatorName: string;     // Added operatorName
  custcode: string;
  fgname: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() {
    // Initialize the BehaviorSubject with data from localStorage
    const initialData = this.retrieveMachineData();
    this._machineData.next(initialData);
  }
  
  private _machineData: BehaviorSubject<{ [key: string]: MachineData }> = new BehaviorSubject<{ [key: string]: MachineData }>({});

  machineData$ = this._machineData.asObservable();

  setMachineData(
    machineName: string, 
    partId: string, 
    partName: string, 
    setterName: string, 
    processName: string, 
    planquantity: number,
    processType: string,   // Added processType
    operatorName: string,   // Added operatorName
    custcode: string,
    fgname: string,
  ) {
    const currentData = this._machineData.getValue();
    currentData[machineName] = { 
      partId, 
      partName, 
      setterName, 
      processName, 
      planquantity, 
      processType,   // Include processType
      operatorName,
      custcode,
      fgname  // Include operatorName
    };
    this._machineData.next(currentData);
    this.storeMachineData(currentData); // Store updated data in localStorage
  }
  
  clearMachineData(machineName: string) {
    const currentData = this._machineData.getValue();
    delete currentData[machineName];
    this._machineData.next(currentData);
    this.storeMachineData(currentData); // Store updated data in localStorage
  }
  
  getMachineData(machineName: string) {
    return this._machineData.getValue()[machineName];
  }

  private storeMachineData(data: { [key: string]: MachineData }) {
    localStorage.setItem('machineData', JSON.stringify(data));
  }
  
  private retrieveMachineData(): { [key: string]: MachineData } {
    const storedData = localStorage.getItem('machineData');
    return storedData ? JSON.parse(storedData) : {};
  }
  
}