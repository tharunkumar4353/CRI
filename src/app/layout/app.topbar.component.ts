import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../demo/service/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService, MessageService],
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

    confirmLogout() {
        this.confirmationService.confirm({
            message: 'Do you want to log out?',
            header: 'Logout Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.logout();
                this.navigateToRoute();

            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/gate']);
    }

    navigateToRoute(): void {
        this.router.navigate(['/auth/gate']);
    }
}
