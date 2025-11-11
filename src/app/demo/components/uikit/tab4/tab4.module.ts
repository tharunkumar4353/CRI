import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab4RoutingModule } from './tab4-routing.module';
import { Tab4Component } from './tab4.component';
import { ButtonModule } from 'primeng/button';
import { Cycle3Component } from './cycle3.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        Tab4RoutingModule
    ],
    declarations: [Tab4Component,Cycle3Component]
})
export class Tab4Module { }
