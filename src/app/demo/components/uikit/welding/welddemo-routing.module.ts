import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WeldDemoComponent } from './welddemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WeldDemoComponent }
    ])],
    exports: [RouterModule]
})
export class WeldDemoRoutingModule { }
