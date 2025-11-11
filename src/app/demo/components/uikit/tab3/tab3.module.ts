import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab3RoutingModule } from './tab3-routing.module';
import { Tab3Component } from './tab3.component';
import { ButtonModule } from 'primeng/button';
import { Cycle2Component } from './cycle2.component';
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
        Tab3RoutingModule
    ],
    declarations: [Tab3Component,Cycle2Component]
})
export class Tab3Module { }
