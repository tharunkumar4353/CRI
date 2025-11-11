import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanDemoRoutingModule } from './plandemo-routing.module';
import { PlanDemoComponent } from './plandemo.component';
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
import { DialogModule } from 'primeng/dialog';


@NgModule({
    imports: [
        CommonModule,
        FileUploadModule,
        DialogModule,
        CalendarModule,
        HttpClientModule,
        FormsModule,
        ButtonModule,
        InputTextareaModule,
        ToggleButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,
        PlanDemoRoutingModule
    ],
    declarations: [PlanDemoComponent],
    providers: [ConfirmationService,DataService],
    bootstrap: [PlanDemoComponent],  // Assuming PlanDemoComponent is your root component

})
export class PlanDemoModule { }
