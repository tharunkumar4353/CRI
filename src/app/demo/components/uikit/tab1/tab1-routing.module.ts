import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Component } from './tab1.component';
import { CycleComponent } from './cycle.component';


const routes: Routes = [
    { path: '', component: Tab1Component },
    { path: 'cycle', component: CycleComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab1RoutingModule { }