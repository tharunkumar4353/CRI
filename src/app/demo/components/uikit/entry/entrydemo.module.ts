import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryDemoRoutingModule } from './entrydemo-routing.module';
import { EntryDemoComponent } from './entrydemo.component';
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
import { CustomerComponent } from './customer.component';
import { EmployeeComponent } from './employee.component';
import { PartComponent } from './part.component';
import { ProcessComponent } from './process.component';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
    imports: [
        TableModule,
        CommonModule,
        FileUploadModule,
        CalendarModule,
        HttpClientModule,
        PaginatorModule,
        FormsModule,
        ButtonModule,
        InputTextareaModule,
        ToggleButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,
        EntryDemoRoutingModule,
        DialogModule,
        AutoCompleteModule
    ],
    declarations: [
        EntryDemoComponent,
        CustomerComponent,
        EmployeeComponent,
        PartComponent,
        ProcessComponent
    ],
    providers: [ConfirmationService,DataService],
    bootstrap: [EntryDemoComponent],  // Assuming PlanDemoComponent is your root component

})
export class EntryDemoModule { }