import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PredictComponent } from './predict.component';
import { SumpredictComponent } from './sumpredict.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PredictComponent },
        { path: 'sumpredict', component: SumpredictComponent },
    ])],
    exports: [RouterModule]
})
export class PredictRoutingModule { }
