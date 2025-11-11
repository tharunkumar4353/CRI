import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab6RoutingModule } from './tab6-routing.module';
import { Tab6Component } from './tab6.component';
import { ButtonModule } from 'primeng/button';
import { Cycle5Component } from './cycle5.component';
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
        Tab6RoutingModule
    ],
    declarations: [Tab6Component,Cycle5Component]
})
export class Tab6Module { }
