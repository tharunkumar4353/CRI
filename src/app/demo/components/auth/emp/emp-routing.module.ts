import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpComponent } from './emp.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EmpComponent }
    ])],
    exports: [RouterModule]
})
export class EmpRoutingModule { }
