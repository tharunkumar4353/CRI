import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FurnaceComponent } from './furnace.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: FurnaceComponent }
    ])],
    exports: [RouterModule]
})
export class FurnaceRoutingModule { }


