import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReasonDemoComponent } from './reasondemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReasonDemoComponent }
    ])],
    exports: [RouterModule]
})
export class ReasonDemoRoutingModule { }
