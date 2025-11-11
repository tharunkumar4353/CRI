import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupDemoComponent } from './setupdemo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SetupDemoComponent }
    ])],
    exports: [RouterModule]
})
export class SetupDemoRoutingModule { }
