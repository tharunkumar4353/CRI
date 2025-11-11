import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestDemoComponent } from './testdemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TestDemoComponent }
    ])],
    exports: [RouterModule]
})
export class TestDemoRoutingModule { }
