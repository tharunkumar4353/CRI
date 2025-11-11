import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductDemoComponent } from './productdemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProductDemoComponent }
    ])],
    exports: [RouterModule]
})
export class ProductDemoRoutingModule { }
