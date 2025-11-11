// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceRecord } from '../components/uikit/planned/planneddemo.component';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DataService {


  private apiUrl = 'http://192.168.16.138:3000'; // Update this URL based on your backend API URL

  constructor(private http: HttpClient) {}

  submitFormData(formData: any[]): Observable<any> {
    return this.http.post('http://192.168.16.138:3000/submit', formData, { responseType: 'text' });
  }

  updateRowprogram(data: FormData, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/programmasterdbedit/${id}`, data);
  
  }
  
  
  deleteRowprogram(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/programmasterdbdelete/${id}`);
   
  }
  

  getFilteredDataprogram(filters: any): Observable<any[]> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get<any[]>(`${this.apiUrl}/api/programmasterdbsearch`, { params });
  }
  

  downloadFileprogram(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/programmasterdb/download/${id}`, { responseType: 'blob' });
  }
  

  getProgrammaster(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/programmasterdb`);
  }

  // Send machine data to the backend
  sendactualcycle(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insertMachineDataactualcycle`, data);
  }



  updateIsActiveStatus(custom_id: string, is_active: boolean) {
    return this.http.post(`${this.apiUrl}/api/updateActiveStatus`, { custom_id, is_active });
  }
  
  insertOEEData(data: { machinename: string; date: Date; oee_percent: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/insertOEEData`, data);
  }

  updateIsActiveStatusnull(custom_id: string, is_active: boolean) {
    return this.http.post(`${this.apiUrl}/api/updateActiveStatusnull`, { custom_id, is_active });
  }
  

  getPartIdsByFgName(fgname: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/partitem101/by-fgname?fgname=${fgname}`);
  }
  getFilteredFgNames(custCode: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/part-dataexcel1101?cust_code=${custCode}`);
  }

  getmachinereports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/reportallocation`);
  }

  getmachineprodreports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/prodreportallocation`);
  }

  getmachineempreports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/empreportallocation`);
  }

  updateEmployeeAcceptCount(customid: string, empAcceptCount: number): Observable<any> {
    const payload = { custom_id: customid, emp_accept_count: empAcceptCount };
    return this.http.post(`${this.apiUrl}/api/updateEmployeeAcceptCount`, payload);
  }

  updatecnc01runtime(customid: string, runtime: number): Observable<any> {
    const payload = { custom_id: customid, run_time_cnc01: runtime };
    return this.http.post(`${this.apiUrl}/api/updateruntimecnc01`, payload);
  }

  updateStartDateTime(custom_id: string): Observable<any> {
    const payload = { custom_id };
    return this.http.post(`${this.apiUrl}/api/updateStartDateTime`, payload);
  }
  
  

  getFilteredcompReports(filters: { cust_code?: string, fg_name?: string, part_id?: string, work_order?:string, fromDate?: any, toDate?: any }): Observable<any[]> {
    let queryParams = new URLSearchParams();
  
    if (filters.cust_code) {
      queryParams.append('cust_code', filters.cust_code);
    }
    if (filters.fg_name) {
      queryParams.append('fg_name', filters.fg_name);
    }
    if (filters.part_id) {
      queryParams.append('part_id', filters.part_id);
    }
    if (filters.work_order) {
      queryParams.append('work_order', filters.work_order);
    }
    if (filters.fromDate) {
      queryParams.append('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      queryParams.append('toDate', filters.toDate);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/api/compreportallocation?${queryParams.toString()}`);
  }
  
  getFilteredReports(filters: { cust_code?: string, fg_name?: string, part_id?: string, work_order?:string, fromDate?: any, toDate?: any }): Observable<any[]> {
    let queryParams = new URLSearchParams();
  
    if (filters.cust_code) {
      queryParams.append('cust_code', filters.cust_code);
    }
    if (filters.fg_name) {
      queryParams.append('fg_name', filters.fg_name);
    }
    if (filters.part_id) {
      queryParams.append('part_id', filters.part_id);
    }
    if (filters.work_order) {
      queryParams.append('work_order', filters.work_order);
    }
    if (filters.fromDate) {
      queryParams.append('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      queryParams.append('toDate', filters.toDate);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/api/reportallocation?${queryParams.toString()}`);
  }

  getFilteredempReports(filters: { settername?: string, operatorname?: string, fromDate?: any, toDate?: string }): Observable<any[]> {
    let queryParams = new URLSearchParams();
  
    if (filters.settername) {
      queryParams.append('settername', filters.settername);  // Ensure key matches server-side
    }
    if (filters.operatorname) {
      queryParams.append('operatorname', filters.operatorname);  // Ensure key matches server-side
    }
  
    if (filters.fromDate) {
      queryParams.append('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      queryParams.append('toDate', filters.toDate);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/api/empreportallocation?${queryParams.toString()}`);
  }
  
  
  
  

  getCycle(value5: string, process_name: string) {
    return this.http.get<any>(`${this.apiUrl}/getCycle`, {
      params: { value5, process_name}
    });
  }

//oee
getoeetotalunits(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/oeetotalunits`);
}
getoeepart1(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/oeepart1`);
}
getoeecycletime(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/oeecycletime`);
}
getoeeacceptcount(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/oeeaccept`);
}



  // Upload file
  uploadFiledemo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/api/uploaddemofile`, formData);
  }

  // Get list of files
  getFileListdemo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/getdemofiles`);
  }

// Download file by ID
downloadFiledemo(fileId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/downloadfromtable/${fileId}`, { responseType: 'json' });
}

getItemDetails(itemCodeOrName: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/itemdetails/${itemCodeOrName}`);
}

getworkorderdetails(workOrserName: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/workorderdetails12/${workOrserName}`);
}

getfgnamedetails(fgName: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/part-fgname1/${fgName}`);
}

updateRecord(id: number, updatedRecord: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/records/${id}`, updatedRecord);
}


deleteRecord(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/api/deleteRecord/${id}`);
  }






  sendQualityData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/insertqualityData`, data);
  }

  getpartgraphdata(machineName: string, startDate: Date, endDate: Date): Observable<any> {
    const params = new HttpParams()
      .set('machineName', machineName)
      .set('startDate', formatDate(startDate, 'yyyy-MM-dd', 'en'))
      .set('endDate', formatDate(endDate, 'yyyy-MM-dd', 'en'));

    return this.http.get(`${this.apiUrl}/api/getpartgraphdata`, { params });
  }


  getMachineData(machineName: string, startDate: Date, endDate: Date): Observable<any> {
    const params = new HttpParams()
      .set('machineName', machineName)
      .set('startDate', formatDate(startDate, 'yyyy-MM-dd', 'en'))
      .set('endDate', formatDate(endDate, 'yyyy-MM-dd', 'en'));

    return this.http.get(`${this.apiUrl}/getMachineData`, { params });
  }
  
// data.service.ts
updateSubmittedStatus(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus/${id}`, {});
}

updateSubmittedStatus1(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus1/${id}`, {});
}
updateSubmittedStatus2(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus2/${id}`, {});

}updateSubmittedStatus3(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus3/${id}`, {});

}updateSubmittedStatus4(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus4/${id}`, {});

}updateSubmittedStatus5(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus5/${id}`, {});

}updateSubmittedStatus6(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus6/${id}`, {});
}

updateSubmittedStatus7(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatus7/${id}`, {});
}

updateSubmittedStatusmachine(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateSubmittedStatusmachine/${id}`, {});
}



  getOee(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/oeevalue`);
  }

  sendMachineData(machineData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insertMachineData`, machineData);
  }
  sendoeepart1Data(machineData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insertoeepartData`, machineData);
  }


  sendPartGraphData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/insertPartGraphData`, data);
  }

  getSetterNames(fromDate?: string, toDate?: string) {
    let params = new HttpParams();
    if (fromDate && toDate) {
      params = params.set('fromDate', fromDate).set('toDate', toDate);
    }
    return this.http.get<any[]>(`${this.apiUrl}/api/getSetterNames`, { params });
  }
  

  getSummaryqualityData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/summaryqualityaccept`);
  }
  getSummaryqualityDatatoday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/summaryqualityaccepttoday`);
  }
  
  
//breakdown maintenance summary
  getbreaksum(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/breaksum`);
  }

  insertbreakmain(data: MaintenanceRecord): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/breakmain`, data);
  }

  getExcelpart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/excelpart`);
  }
  getExcelemp(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/excelemp`);
  }
  getExcelprocess(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/excelprocess`);
  }

  //process mapping 
getpromaping(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/promap`);
}

getProcessNamesByPartId(partId: string): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/process/names/${partId}`);
}

getProcessNamesByPartIdpart(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/process/partname`);
}


//cnc machines
getCNC01(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/cnc01machine`);
}

//vmc machines
getVMC01(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/vmc01machine`);
}

//weld machines
getWELD01(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/weld01machine`);
}

//weld machines
getTEST01(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/test01machine`);
}

updatePartData(part: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-part`, part);
}

deletePartData(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete-part/${id}`);
  }


//machine allocation
allocation(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/machineallocation`, data);
}

getPartDetails(itemCode: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/partiddetails/${itemCode}`);
}

getPartnameNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/partid/names`);
}

//tab screens
getEmptab(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab`);
}

getEmptab2(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab2`);
}

getEmptab3(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab3`);
}

getEmptab4(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab4`);
}

getEmptab5(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab5`);
}


getEmptab6(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab6`);
}
getEmptab7(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/emptab7`);
}


//signup
  signin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login`, data);
  } 
//signin
pass(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/check`, data);
} 
//change password
changepass(id: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/change-password`, { id, password });
}
//get ma
getmachineshow(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/getmachine`);
}
getMachineShowToday(machine: string | null, dateFrom: string | null, dateTo: string | null): Observable<any[]> {
  let params = new HttpParams();
  
  if (machine) {
    params = params.set('machine', machine);
  }
  if (dateFrom) {
    params = params.set('dateFrom', dateFrom);
  }
  if (dateTo) {
    params = params.set('dateTo', dateTo);
  }

  return this.http.get<any[]>(`${this.apiUrl}/api/getmachinetoday`, { params });
}


  // Implement the insertData method based on your backend API endpoint
  insertiteration(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/iteration`, data);
  } 
  insertData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/planning`, data);
  } 
  insertsetuptime(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/setuptime`, data);
  } 
  insertquality(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/quality`, data);
  } 

  getQuantityshow(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/quantityshow`);
  }
  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/qualitydata`); // Update endpoint to /api/data
  }
   
  // customer entry CRUD operation
  getCustomerData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer_entry`);
  }
  insertData1(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert1`,data);
  }

  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/customers/${id}`, data);
  }
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/customers/${id}`);
  }

// employee entry CRUD operation
  insertEmployeeData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insertEmployee`, data);
  }
  getEmployeeData() {
    return this.http.get<any[]>(`${this.apiUrl}/employee_entry`);
  }

  updateEmployee(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/employees/${id}`, updatedData);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/employees/${id}`);
  }

  // part entry CRUD operation
  insertPartEntry(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/insertPartEntry`, data);
  }

  getPartEntries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/part_entries`);
  }

  updatePartEntry(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/parts/${id}`, updatedData);
  }

  deletePartEntry(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/parts/${id}`);
  }



// process entry CRUD operation
// process entry CRUD operation
 // data.service.ts (Assuming this is the correct file)
 insertFormData(formData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/insertFormData`, formData);
}
getProcesses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/processes`);
}
updateProcess(id: number, updatedData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/processes/${id}`, updatedData);
}
deleteProcess(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/api/processes/${id}`);
}
  


  getTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/tableData`);
  }

  updateItem(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItem/${item.id}`, item);
  }
  deleteItem(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItem/${itemId}`);
  }

  getAnotherTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/anotherTableData`);
  }

  updateItemc(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemc/${item.id}`, item);
  }
  deleteItemc(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemc/${itemId}`);
  }

  getPlannedTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/plannedTableData`);
  }
  updateItema(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItema/${item.id}`, item);
  }
  deleteItema(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItema/${itemId}`);
  }

  getPlanTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/planTableData`);
  }
  updateItemb(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemb/${item.id}`, item);
  }
  deleteItemb(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemb/${itemId}`);
  }

  getPlannTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/plannTableData`);
  }
  updateItemd(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemd/${item.id}`, item);
  }
  deleteItemd(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemd/${itemId}`);
  }

  getPlanvTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/planvTableData`);
  }
  updateIteme(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateIteme/${item.id}`, item);
  }
  deleteIteme(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteIteme/${itemId}`);
  }

  


//vmc2
getPlanvmc2TableData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/planvmc2TableData`);
}
updateItemev(item: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/updateItemev/${item.id}`, item);
}
deleteItemev(itemId: any): Observable<any> {
  return this.http.delete(`${this.apiUrl}/api/deleteItemev/${itemId}`);
}


  getPlanwaTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/planwaTableData`);
  }
  updateItemf(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemf/${item.id}`, item);
  }
  deleteItemf(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemf/${itemId}`);
  }

  getPlanwmTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/planwmTableData`);
  }
  updateItemg(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemg/${item.id}`, item);
  }
  deleteItemg(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemg${itemId}`);
  }

  getPlanteTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/planteTableData`);
  }
  updateItemh(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemh/${item.id}`, item);
  }
  deleteItemh(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemh/${itemId}`);
  }

  getPlantesTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/plantesTableData`);
  }
  updateItemi(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemi/${item.id}`, item);
  }
  deleteItemi(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemi/${itemId}`);
  }

  getPlantestTableData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/plantestTableData`);
  }
  updateItemj(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/updateItemj/${item.id}`, item);
  }
  deleteItemj(itemId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/deleteItemj/${itemId}`);
  }
  getCustomerNames1(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/customers/names`);
  }
  getCustomerNames2(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/customers/names`);
  }

  getQualityData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/qualitysum`);
  }

//new
getPartNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/part/names`);
}

getPartitemNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/partitem/names`);
}

getPartitemId(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/partitem/id`);
}
//process tableentry
getProcesstable(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/process_table`);
}

//new process entry module 
saveProcess(process: any): Observable<any> {
  return this.http.post<any>( `${this.apiUrl}/api/process`  , process);
}

getProcessitemNames() : Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/processitem/names`);
}

getProcessnameNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/processname/names`);
}

getProcesstypeNames() : Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/processtype/names`);
}

tableProcess(formData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/tableprocess`, formData);
}

getProcess(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/processentry`);
}  

getFilteredData(setterName: string, fromDate: string, toDate: string): Observable<any> {
  let params = new HttpParams();
  if (setterName) params = params.set('setterName', setterName);
  if (fromDate) params = params.set('fromDate', fromDate);
  if (toDate) params = params.set('toDate', toDate);

  return this.http.get<any>(`${this.apiUrl}/getFilteredData`, { params });
}


getFilteredDataoperator(operatorName: string, fromDate: string, toDate: string): Observable<any> {
  let params = new HttpParams();
  if (operatorName) params = params.set('operatorName', operatorName);
  if (fromDate) params = params.set('fromDate', fromDate);
  if (toDate) params = params.set('toDate', toDate);

  return this.http.get<any>(`${this.apiUrl}/getFilteredDataoperator`, { params });
}

getEmpitemNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/empitem/names`);
}


getEmpitemNamesop(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/empitem/namesop`);
}

getPartitemNamespart(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/partitemname/names`);
}

//machine setter part name
getPartmacNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/partmac/names`);
}

insertmachineData(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/insertDatamac`, data);
}
getProcessDetails(itemCode: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/processdetails/${itemCode}`);
}

getProcessNameDetails(itemCode: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/processnamedetails/${itemCode}`);
}
getPlannedCycleTime(partId: any, processName: any): Observable<any> {
  const encodedPartId = encodeURIComponent(partId);
  const encodedProcessName = encodeURIComponent(processName);
  return this.http.get<any>(`${this.apiUrl}/getPlannedCycleTime/${encodedPartId}/${encodedProcessName}`);
}

getPartdataexcel(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/part-dataexcel`);
}

getPartdataexcelwork(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/part-dataexcelwork`);
}


getPartdataexcel1(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/part-dataexcel1`);
}
//live data server db

saveGeneralInfo(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/general_info`, data);
}
saveInstallationDetails(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/installation_detail`, data);
}

saveMachineSpecification(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/machine_specifications`, data);
}

saveSafetyCompliance(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/safety_compliance`, data);
}

saveInitialTestingCalibration(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/initial_testing_calibration`, data);
}

saveMaintenanceSchedule(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/maintenance_schedule`, data);
}

saveTrainingAndDocumentation(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/training_and_documentation`, data);
}

saveWarrantyAndSupport(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/warranty_and_support`, data);
}

//get machine name
getMachineNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/machine/names`);
}
getMachineNameDetails(itemCode: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/machinenamedetails/${itemCode}`);
}
saveMaintenanceData(data: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/maintenance_logs`, data);
}
saveIncidentData(data: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/incident_logs`, data);
}
savePerformanceData(data: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/performance_logs`, data);
}

savePartsReplacementData(data: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/parts_replacement_logs`, data);
}

saveScheduledMaintenanceData(data: any[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/scheduled_maintenance_logs`, data);
}

saveMachineData(machineData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/machinedata`, machineData);
}

saveMachine1Data(machineData1: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/machinedata1`, machineData1);
}



saveConditionMonitoringData(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/conditionMonitoring`, data);
}

savePredictionLogData(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/predictionLog`, data);
}

saveMaintenanceActionsData(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/maintenanceActions`, data);
}

savePostMaintenanceData(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/postMaintenance`, data);
}




getConditionMonitoringData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/condition_monitoringdata`);
}

getPredictionLogData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/prediction_log`);
}

getMaintenanceActionTakenData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/maintenance_actiontaken`);
}

getPostMaintenanceAnalysisData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/post_maintenanceanalysis`);
}

getMaintenanceRepairLog(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/maintenance_repairlog`);
}

getIncidentLog(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/incident_log`);
}

getPerformanceUtilization(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/performance_utilization`);
}

getPartReplacement(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/part_replacement`);
}

getScheduledMaintenance(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/scheduled_maintenance`);
}


getMachineDatasum(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/general_information`);
}
getWarrantySupportData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/warranty_support`);
}

getTrainingDocumentationData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/training_documentation`);
}

getMaintenanceScheduleData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/maintenance_schedule`);
}

getInitialTestingCalibrationData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/initialtesting_calibration`);
}

getSafetyComplianceData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/safety_compliance`);
}

getMachineSpecificationsData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/machine_specifications`);
}

getInstallationDetailData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/installation_detail`);
}

getAllocationsBySetter(setterName: string): Observable<any[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get<any[]>(`${this.apiUrl}/machine_allocation?setterName=${setterName}`, { headers });
}

getUploadedFiles(): Observable<{ name: string }[]> {
  return this.http.get<{ name: string }[]>(`${this.apiUrl}/api/uploadedfiles`);
}

downloadFile(fileName: string): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/api/download/${fileName}`, { responseType: 'blob' });
}

allocationUpload(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/allocation`, data);
}



}
