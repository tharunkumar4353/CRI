import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanDemoComponent } from './plandemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PlanDemoComponent }
    ])],
    exports: [RouterModule]
})
export class PlanDemoRoutingModule { }
