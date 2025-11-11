import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab2RoutingModule } from './tab2-routing.module';
import { Tab2Component } from './tab2.component';
import { ButtonModule } from 'primeng/button';
import { Cycle1Component } from './cycle1.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        DropdownModule,
        HttpClientModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        Tab2RoutingModule
    ],
    declarations: [Tab2Component,Cycle1Component]
})
export class Tab2Module { }
