import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab1RoutingModule } from './tab1-routing.module';
import { Tab1Component } from './tab1.component';
import { ButtonModule } from 'primeng/button';
import { CycleComponent } from './cycle.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
    imports: [
        CommonModule,
        InputTextModule,
        DialogModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        Tab1RoutingModule
    ],
    declarations: [Tab1Component,CycleComponent]
})
export class Tab1Module { }
