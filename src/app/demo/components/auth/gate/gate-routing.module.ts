import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GateComponent } from './gate.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GateComponent }
    ])],
    exports: [RouterModule]
})
export class GateRoutingModule { }
