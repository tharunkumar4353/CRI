import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab6Component } from './tab6.component';
import { Cycle5Component } from './cycle5.component';


const routes: Routes = [
    { path: '', component: Tab6Component },
    { path: 'cycle5', component: Cycle5Component },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab6RoutingModule { }