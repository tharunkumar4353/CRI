import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Component } from './tab2.component';
import { Cycle1Component } from './cycle1.component';


const routes: Routes = [
    { path: '', component: Tab2Component },
    { path: 'cycle1', component: Cycle1Component },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab2RoutingModule { }