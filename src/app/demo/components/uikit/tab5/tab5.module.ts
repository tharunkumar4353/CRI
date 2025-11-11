import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab5RoutingModule } from './tab5-routing.module';
import { Tab5Component } from './tab5.component';
import { ButtonModule } from 'primeng/button';
import { Cycle4Component } from './cycle4.component';
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
        Tab5RoutingModule
    ],
    declarations: [Tab5Component,Cycle4Component]
})
export class Tab5Module { }
