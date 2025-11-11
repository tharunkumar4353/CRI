import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from 'src/app/demo/service/data.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/app/demo/service/socket.service';
import { Cnc1Component } from './cnc1.component';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { BellnoComponent } from './bellno.component';
import { BtoolnoComponent } from './btoolno.component';
import { ChecknoComponent } from './checkno.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator'; 
// const config: SocketIoConfig = {
//     url: 'http://192.168.0.106:5000',  // URL of your Flask-SocketIO server
//     options: {
//       transports: ['websocket'],
//       withCredentials: false,
//     }
//   };
  

@NgModule({
    imports: [
        CommonModule,
        FileUploadModule,
        CalendarModule,
        HttpClientModule,
        FormsModule,
        PaginatorModule,
        ButtonModule,
        InputTextareaModule,
        ToggleButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,
        // SocketIoModule.forRoot(config),
        DashboardsRoutingModule,
        ToastModule,
        ProgressBarModule,
        ChartModule
    ],
    declarations: [DashboardComponent,
		Cnc1Component,

		BellnoComponent,
		BtoolnoComponent,
		ChecknoComponent
	],
    providers: [ConfirmationService,DataService,SocketService],
    bootstrap: [DashboardComponent],  // Assuming PlanDemoComponent is your root component

})
export class DashboardModule { }