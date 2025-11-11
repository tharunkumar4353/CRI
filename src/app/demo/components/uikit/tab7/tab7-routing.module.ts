import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab7Component } from './tab7.component';
import { Cycle6Component } from './cycle6.component';


const routes: Routes = [
    { path: '', component: Tab7Component },
    { path: 'cycle6', component: Cycle6Component },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab7RoutingModule { }