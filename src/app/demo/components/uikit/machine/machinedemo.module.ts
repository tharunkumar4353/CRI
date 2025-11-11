import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineDemoRoutingModule } from './machinedemo-routing.module';
import { MachineDemoComponent } from './machinedemo.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { SummaryComponent } from './summary.component';
import { ScrollerModule } from 'primeng/scroller';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
    imports: [
        CommonModule,
        MachineDemoRoutingModule,
        InputTextModule,
        CalendarModule,
        FieldsetModule,
        PaginatorModule,
        TableModule,
        NgxMaterialTimepickerModule,
        DialogModule,
        AutoCompleteModule,
        TimepickerModule.forRoot(),  // Import TimepickerModule here

        FormsModule,
        KnobModule,
        ScrollerModule,
        ChartModule,
        
        DropdownModule
    ],
    declarations: [MachineDemoComponent,SummaryComponent],
    providers: [DatePipe]
})
export class MachineDemoModule { }