import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { EntryDemoComponent } from './entrydemo.component';
import { CustomerComponent } from './customer.component';
import { EmployeeComponent } from './employee.component';
import { PartComponent } from './part.component';
import { ProcessComponent } from './process.component';

const routes: Routes = [
    { path: '', component: EntryDemoComponent },
    { path: 'customer', component: CustomerComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'part', component: PartComponent },
    { path: 'process', component: ProcessComponent}
    
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class EntryDemoRoutingModule { }
