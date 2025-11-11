import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab4Component } from './tab4.component';
import { Cycle3Component } from './cycle3.component';


const routes: Routes = [
    { path: '', component: Tab4Component },
    { path: 'cycle3', component: Cycle3Component },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab4RoutingModule { }