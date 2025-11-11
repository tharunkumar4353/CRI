import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
  templateUrl: './customer.component.html',
})
export class CustomerComponent  {
  

  constructor(
    private location: Location,
    private dataService: DataService,
    private http: HttpClient,
  ) {}


}
