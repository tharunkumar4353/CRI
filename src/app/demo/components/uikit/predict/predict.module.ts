import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictRoutingModule } from './predict-routing.module';
import { PredictComponent } from './predict.component';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
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
import { DialogModule } from 'primeng/dialog';
import { SumpredictComponent } from './sumpredict.component';
import { TabViewModule } from 'primeng/tabview';
@NgModule({
    imports: [
        CommonModule,
        PredictRoutingModule,
        CommonModule,
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
    declarations: [PredictComponent, SumpredictComponent]
})
export class PredictModule { }
