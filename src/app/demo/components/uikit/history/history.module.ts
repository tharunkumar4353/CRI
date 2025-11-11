import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import { TabViewModule } from 'primeng/tabview';
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
import { PaginatorModule } from 'primeng/paginator';
import { SumhistoryComponent } from './sumhistory.component';


import { DialogModule } from 'primeng/dialog';
@NgModule({
    imports: [
        CommonModule,
        HistoryRoutingModule,
        FieldsetModule,
        InputTextModule,
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
        PaginatorModule,
        FieldsetModule,
        DialogModule,
        TabViewModule
    ],
    declarations: [HistoryComponent , SumhistoryComponent]
})
export class HistoryModule { }
