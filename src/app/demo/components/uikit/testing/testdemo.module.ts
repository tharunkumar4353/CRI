import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestDemoRoutingModule } from './testdemo-routing.module';
import { TestDemoComponent } from './testdemo.component';
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
        TestDemoRoutingModule,
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
    ],
    providers: [ConfirmationService,DataService],
    declarations: [TestDemoComponent]
})
export class TestDemoModule { }
