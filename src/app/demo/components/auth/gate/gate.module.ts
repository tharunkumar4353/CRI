import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GateRoutingModule } from './gate-routing.module';
import { GateComponent } from './gate.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        GateRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule
    ],
    declarations: [GateComponent]
})
export class GateModule { }
