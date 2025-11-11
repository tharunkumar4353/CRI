import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpRoutingModule } from './emp-routing.module';
import { EmpComponent } from './emp.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        CommonModule,
        EmpRoutingModule,
        ButtonModule,
        DropdownModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule
    ],
    declarations: [EmpComponent]
})
export class EmpModule { }
