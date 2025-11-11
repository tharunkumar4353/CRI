import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';

@Component({
    selector: 'app-gate',
    templateUrl: './gate.component.html'
})
export class GateComponent {
    constructor(private router: Router, private authService: AuthService) { }

    admin() {
        this.authService.login('adminToken'); // Simulate logging in
        this.router.navigate(['/auth/login']); // Navigate to the dashboard or any protected route
    }

    emp() {
        this.authService.login('employeeToken'); // Simulate logging in
        this.router.navigate(['/auth/emp']); // Navigate to the dashboard or any protected route
    }
}
