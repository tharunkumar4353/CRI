import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineDemoComponent } from './machinedemo.component';
import { SummaryComponent } from './summary.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MachineDemoComponent },
        { path: 'summary', component: SummaryComponent }


    ])],
    exports: [RouterModule]
})
export class MachineDemoRoutingModule { }
