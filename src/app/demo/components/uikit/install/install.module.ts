import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallRoutingModule } from './install-routing.module';
import { InstallComponent } from './install.component';
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
import { PaginatorModule } from 'primeng/paginator';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { SuminstallComponent } from './suminstall.component';
import { TabViewModule } from 'primeng/tabview';




@NgModule({
    imports: [
        InstallRoutingModule,
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
        PaginatorModule,
        FieldsetModule,
        DialogModule,
        TabViewModule
   
        
    ],
    declarations: [InstallComponent ,SuminstallComponent],
    providers: [ConfirmationService,MessageService,DataService,DatePipe],

})
export class InstallModule { }
