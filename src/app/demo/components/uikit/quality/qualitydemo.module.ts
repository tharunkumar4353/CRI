import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityDemoRoutingModule } from './qualitydemo-routing.module';
import { QualityDemoComponent } from './qualitydemo.component';
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
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';



@NgModule({
    imports: [
        CommonModule,
        FileUploadModule,
        CalendarModule,
        HttpClientModule,
        FormsModule,
        ButtonModule,
        InputTextareaModule,
        ToggleButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DropdownModule,
        QualityDemoRoutingModule
    ],
    declarations: [
        QualityDemoComponent,
    ],
    providers: [ConfirmationService,DataService,MessageService,PrimeNGConfig],
    bootstrap: [QualityDemoComponent],  // Assuming PlanDemoComponent is your root component

})
export class QualityDemoModule { }
