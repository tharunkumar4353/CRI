import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDemoRoutingModule } from './productdemo-routing.module';
import { ProductDemoComponent } from './productdemo.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ProductDemoRoutingModule,
        FormsModule
    ],
    declarations: [ProductDemoComponent]
})
export class ProductDemoModule { }
