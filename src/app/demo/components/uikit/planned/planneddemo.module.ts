import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannedDemoRoutingModule } from './planneddemo-routing.module';
import { PlannedDemoComponent } from './planneddemo.component';
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
import { SumplannedComponent } from './sumplanned.component';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
@NgModule({
    imports: [
        CommonModule,
        FileUploadModule,
        CalendarModule,
        DialogModule,
        AutoCompleteModule,
        HttpClientModule,
        FormsModule,
        ButtonModule,
        InputTextareaModule,
        ToggleButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,
        PlannedDemoRoutingModule,
        TabViewModule
        
    ],
    declarations: [PlannedDemoComponent, SumplannedComponent],
    providers: [ConfirmationService,DataService],
    bootstrap: [PlannedDemoComponent],  // Assuming PlanDemoComponent is your root component

})
export class PlannedDemoModule { }
