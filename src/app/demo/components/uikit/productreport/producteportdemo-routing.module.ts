import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductreportDemoComponent } from './producteportdemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProductreportDemoComponent }
    ])],
    exports: [RouterModule]
})
export class ProductreportDemoRoutingModule { }
