import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InstallComponent } from './install.component';
import { SuminstallComponent } from './suminstall.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InstallComponent },
        { path: 'suminstall', component: SuminstallComponent }
    ])],
    exports: [RouterModule]
})
export class InstallRoutingModule { }
