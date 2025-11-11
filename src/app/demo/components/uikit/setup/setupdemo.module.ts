import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupDemoRoutingModule } from './setupdemo-routing.module';
import { SetupDemoComponent } from './setupdemo.component';
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
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        FileUploadModule,
        CalendarModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextareaModule,
        ToggleButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,
        SetupDemoRoutingModule
    ],
    declarations: [SetupDemoComponent],
    providers: [ConfirmationService,MessageService,DataService],
    bootstrap: [SetupDemoComponent],  // Assuming PlanDemoComponent is your root component

})
export class SetupDemoModule { }
