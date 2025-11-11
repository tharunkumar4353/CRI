import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Component } from './tab3.component';
import { Cycle2Component } from './cycle2.component';


const routes: Routes = [
    { path: '', component: Tab3Component },
    { path: 'cycle2', component: Cycle2Component },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class Tab3RoutingModule { }