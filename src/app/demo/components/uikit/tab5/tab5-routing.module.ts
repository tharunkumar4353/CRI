import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab5Component } from './tab5.component';
import { Cycle4Component } from './cycle4.component';


const routes: Routes = [
    { path: '', component: Tab5Component },
    { path: 'cycle4', component: Cycle4Component },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab5RoutingModule { }