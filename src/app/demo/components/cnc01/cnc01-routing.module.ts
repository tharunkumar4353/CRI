import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cnc01Component } from './cnc01.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: Cnc01Component }
    ])],
    exports: [RouterModule]
})
export class Cnc01RoutingModule { }
