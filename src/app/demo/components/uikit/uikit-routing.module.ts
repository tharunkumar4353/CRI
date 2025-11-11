import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'machine', data: { breadcrumb: 'Machine' }, loadChildren: () => import('./machine/machinedemo.module').then(m => m.MachineDemoModule) },
        { path: 'welding', data: { breadcrumb: 'Welding' }, loadChildren: () => import('./welding/welddemo.module').then(m => m.WeldDemoModule) },
        { path: 'planning', data: { breadcrumb: 'Planning' }, loadChildren: () => import('./planning/plandemo.module').then(m => m.PlanDemoModule) },
        { path: 'product', data: { breadcrumb: 'Product' }, loadChildren: () => import('./product/productdemo.module').then(m => m.ProductDemoModule) },
        { path: 'testing', data: { breadcrumb: 'Testing' }, loadChildren: () => import('./testing/testdemo.module').then(m => m.TestDemoModule) },
        { path: 'setup', data: { breadcrumb: 'Setup' }, loadChildren: () => import('./setup/setupdemo.module').then(m => m.SetupDemoModule) },
        { path: 'entry', data: { breadcrumb: 'Entry' }, loadChildren: () => import('./entry/entrydemo.module').then(m => m.EntryDemoModule) },
        { path: 'quality', data: { breadcrumb: 'Quality' }, loadChildren: () => import('./quality/qualitydemo.module').then(m => m.QualityDemoModule) },
        { path: 'planned', data: { breadcrumb: 'planned' }, loadChildren: () => import('./planned/planneddemo.module').then(m => m.PlannedDemoModule) },
        { path: 'reasoning', data: { breadcrumb: 'reasoning' }, loadChildren: () => import('./reasoning/reasondemo.module').then(m => m.ReasonDemoModule) },
        { path: 'tab1', data: { breadcrumb: 'tab1' }, loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1Module) },
        { path: 'tab2', data: { breadcrumb: 'tab2' }, loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2Module) },
        { path: 'tab3', data: { breadcrumb: 'tab3' }, loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3Module) },
        { path: 'tab4', data: { breadcrumb: 'tab4' }, loadChildren: () => import('./tab4/tab4.module').then(m => m.Tab4Module) },
        { path: 'tab5', data: { breadcrumb: 'tab5' }, loadChildren: () => import('./tab5/tab5.module').then(m => m.Tab5Module) },
        { path: 'tab6', data: { breadcrumb: 'tab6' }, loadChildren: () => import('./tab6/tab6.module').then(m => m.Tab6Module) },
        { path: 'tab7', data: { breadcrumb: 'tab7' }, loadChildren: () => import('./tab7/tab7.module').then(m => m.Tab7Module) },
        { path: 'install', data: { breadcrumb: 'Install' }, loadChildren: () => import('./install/install.module').then(m => m.InstallModule) },
        { path: 'history', data: { breadcrumb: 'History' }, loadChildren: () => import('./history/history.module').then(m => m.HistoryModule) },
        { path: 'predict', data: { breadcrumb: 'Predict' }, loadChildren: () => import('./predict/predict.module').then(m => m.PredictModule) },
        { path: 'productreport', data: { breadcrumb: 'Productreport' }, loadChildren: () => import('./productreport/producteportdemo.module').then(m => m.ProductreportDemoModule) },



        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
