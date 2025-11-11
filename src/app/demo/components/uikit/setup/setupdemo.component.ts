import { Component } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';


@Component({
  templateUrl: './setupdemo.component.html',
})
export class SetupDemoComponent {


  constructor(private dataService: DataService, private messageService: MessageService, private http: HttpClient) {}

}
