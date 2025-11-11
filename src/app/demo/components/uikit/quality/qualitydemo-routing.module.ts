import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QualityDemoComponent } from './qualitydemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: QualityDemoComponent },

    ])],
    exports: [RouterModule]
})
export class QualityDemoRoutingModule { }
