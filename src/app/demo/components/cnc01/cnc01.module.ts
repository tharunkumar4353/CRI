import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cnc01RoutingModule } from './cnc01-routing.module';
import { Cnc01Component } from './cnc01.component';

@NgModule({
    imports: [
        CommonModule,
        Cnc01RoutingModule
    ],
    declarations: [Cnc01Component]
})
export class Cnc01Module { }
