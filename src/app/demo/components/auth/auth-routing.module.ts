import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GateComponent } from './gate/gate.component';
import { LoginComponent } from './login/login.component';
import { EmpComponent } from './emp/emp.component';
const routes: Routes = [
    { path: '', component: GateComponent }, // Landing page
    { path: 'login', component: LoginComponent },
    { path: 'emp', component: EmpComponent },

];
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'gate', loadChildren: () => import('./gate/gate.module').then(m => m.GateModule) },
        { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
        { path: 'emp', loadChildren: () => import('./emp/emp.module').then(m => m.EmpModule) },
        { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },

        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
