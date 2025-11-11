import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlannedDemoComponent } from './planneddemo.component';
import { SumplannedComponent } from './sumplanned.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PlannedDemoComponent },
        {path: 'sumplanned',component:SumplannedComponent}
    ])],
    exports: [RouterModule]
})
export class PlannedDemoRoutingModule { }
