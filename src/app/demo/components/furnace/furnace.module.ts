import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FurnaceComponent } from './furnace.component';
import { FurnaceRoutingModule } from './furnace-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';

import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';

import { BreadcrumbModule } from 'primeng/breadcrumb';

import { ChartModule } from 'primeng/chart'


@NgModule({
	imports: [
			CommonModule,
        		FormsModule,
        		FurnaceRoutingModule,
        		AutoCompleteModule,
        		CalendarModule,
        		ChipsModule,
        		DropdownModule,
        		InputMaskModule,
        		InputNumberModule,
        		CascadeSelectModule,
        		MultiSelectModule,
        		InputTextareaModule,
        		InputTextModule,
                		TableModule,
                		RatingModule,
                		ButtonModule,
                		SliderModule,
                		ToggleButtonModule,
                		RippleModule,
                		ProgressBarModule,
                		ToastModule,
                		DialogModule,
                		OverlayPanelModule,
                		ConfirmDialogModule,
                		SidebarModule,
                		ConfirmPopupModule,
                		TooltipModule,
        		BreadcrumbModule,
        				ChartModule

	],
	declarations: [FurnaceComponent]
})
export class FurnaceModule { }
