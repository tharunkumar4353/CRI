import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { Cnc1Component } from './cnc1.component';

import { BellnoComponent } from './bellno.component';
import { BtoolnoComponent } from './btoolno.component';
import { ChecknoComponent } from './checkno.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: 'card1', component:Cnc1Component},

        { path: 'bellno', component:BellnoComponent},
        { path: 'btoolno', component: BtoolnoComponent},
        { path: 'checkno', component: ChecknoComponent}

    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }


