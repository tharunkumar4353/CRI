import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from 'src/app/demo/service/auth.service';
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService, 
        private authService: AuthService, 
    ) { }

    ngOnInit() {
        const role = this.authService.getRole();
        const selectedMachine = this.authService.getSelectedMachine();

        if (selectedMachine) {
            this.model = [
                {
                    label: 'Tab Screens',
                    items: [
                        { label: selectedMachine.name, icon: '', routerLink: [selectedMachine.route] }
                    ]
                }
            ];
        } else if (role === 'admin') {
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'fa-solid fa-house', routerLink: ['/'] },
                        { label: 'Master Data', icon: 'fa-solid fa-door-open', routerLink: ['/uikit/entry'] },

                        { label: 'Machine Allocation', icon: 'fa-solid fa-cash-register',routerLink: ['/uikit/machine'] },
                        { label: 'Quality', icon: 'fa-solid fa-check-to-slot', routerLink: ['/uikit/quality'] },
                        { label: 'Program Master', icon: 'fa-solid fa-check-to-slot', routerLink: ['/uikit/welding'] },
                        { label: 'Maintenance', icon: 'fa-solid fa-screwdriver-wrench',
                            items: [
                                { label: 'Machine Installation Record', routerLink: ['/uikit/install'] },
                                { label: 'Machine Breakdown Maintenance Record', routerLink: ['/uikit/planned'] },
                                { label: 'History Card', routerLink: ['/uikit/history'] },
                                { label: 'Predictive Maintenance Record ', routerLink: ['/uikit/predict'] },
                            ]
                        },

                        { label: 'Reports', icon: 'fa-regular fa-clipboard',
                            items: [
                                { label: 'Planning Reports', routerLink: ['/uikit/planning'] },
                                { label: 'Employee Reports', routerLink: ['/uikit/reasoning'] },
                                { label: 'Complete Reports', routerLink: ['/uikit/testing'] },
                                { label: 'OEE Reports', routerLink: ['/uikit/productreport'] },



                            ]
                        },
                        // { label: 'demo', icon: 'fa-solid fa-screwdriver-wrench',routerLink: ['/uikit/product'] },
                        // { label: 'plan', icon: 'fa-solid fa-screwdriver-wrench',routerLink: ['/uikit/planning'] },

                    ]
                },
                {
                    label: 'Tab Screens',
                    items: [
                        { label: 'Tab-1 - CNC001', icon: '', routerLink: ['/uikit/tab1'] },
                        { label: 'Tab-2 - CNC002', icon: '', routerLink: ['/uikit/tab2'] },
                        { label: 'Tab-3 - CNC003', icon: '', routerLink: ['/uikit/tab3'] },
                        { label: 'Tab-4 - CNC004', icon: '', routerLink: ['/uikit/tab4'] },
                        { label: 'Tab-5 - CNC005', icon: '', routerLink: ['/uikit/tab5'] },
                        { label: 'Tab-6 - VMC001', icon: '', routerLink: ['/uikit/tab6'] },
                        { label: 'Tab-7 - VMC002', icon: '', routerLink: ['/uikit/tab7'] },
                    ]
                }
            ];
        // } else if (role === 'employee') {
        //     this.model = [
        //         {
        //             label: 'Tab Screens',
        //             items: [
        //                 { label: 'Tab-1 - CNC001', icon: '', routerLink: ['/uikit/tab1'] },
        //                 { label: 'Tab-2 - CNC002', icon: '', routerLink: ['/uikit/tab2'] },
        //                 { label: 'Tab-3 - CNC003', icon: '', routerLink: ['/uikit/tab3'] },
        //                 { label: 'Tab-4 - CNC004', icon: '', routerLink: ['/uikit/tab4'] },
        //                 { label: 'Tab-5 - CNC005', icon: '', routerLink: ['/uikit/tab5'] },
        //                 { label: 'Tab-6 - VMC001', icon: '', routerLink: ['/uikit/tab6'] },
        //             ]
        //         }
        //     ];
        // }

        }
    }
}
