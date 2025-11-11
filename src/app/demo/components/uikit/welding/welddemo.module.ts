import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeldDemoRoutingModule } from './welddemo-routing.module';
import { WeldDemoComponent } from './welddemo.component';
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
        InputTextareaModule,
        FormsModule,
        ConfirmDialogModule,
        HttpClientModule,
        DropdownModule,
        FileUploadModule,
        ToggleButtonModule,
        DialogModule,
        CalendarModule,
        ButtonModule,
        WeldDemoRoutingModule,
        InputTextModule
    ],
    declarations: [WeldDemoComponent],
    providers: [ConfirmationService,DataService],

})
export class WeldDemoModule { }
