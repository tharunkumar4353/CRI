import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HistoryComponent } from './history.component';
import { SumhistoryComponent } from './sumhistory.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HistoryComponent },
        { path: 'sumhistory', component: SumhistoryComponent },
    ])],
    exports: [RouterModule]
})
export class HistoryRoutingModule { }
