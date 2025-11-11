import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab7RoutingModule } from './tab7-routing.module';
import { Tab7Component } from './tab7.component';
import { ButtonModule } from 'primeng/button';
import { Cycle6Component } from './cycle6.component';
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
        Tab7RoutingModule
    ],
    declarations: [Tab7Component,Cycle6Component]
})
export class Tab7Module { }
