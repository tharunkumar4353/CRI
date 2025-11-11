import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';
@Component({
    selector: 'app-access',
    templateUrl: './emp.component.html',
})
export class EmpComponent {
    emp: string;
    password: string;
    selectedMachine: any;
    machines: any[] = [
        // { code: 'C1', name: 'CNC 001', route: '/uikit/tab1' },
        { code: 'C2', name: 'CNC 002', route: '/uikit/tab2' },
        { code: 'C3', name: 'CNC 003', route: '/uikit/tab3' },
        { code: 'C4', name: 'CNC 004', route: '/uikit/tab4' },
        { code: 'C5', name: 'CNC 005', route: '/uikit/tab5' },
        { code: 'V1', name: 'VMC 001', route: '/uikit/tab6' },
        { code: 'V2', name: 'VMC 002', route: '/uikit/tab7' }
    ];

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    login(): void {
        if (!this.emp || !this.password || !this.selectedMachine) {
            alert('Please fill in all fields');
            return;
        }

        // Send a POST request to the backend API endpoint with the entered credentials and selected machine
        this.http.post<any>('http://192.168.16.138:3000/api/check', { emp: this.emp, password: this.password, machine: this.selectedMachine.code })
            .subscribe(
                (response) => {
                    // Store the selected machine in the service
                    this.authService.setSelectedMachine(this.selectedMachine);
                    // Login successful, navigate to the corresponding tab based on the selected machine
                    console.log('Login successful:', response);
                    this.router.navigate([this.selectedMachine.route]);
                },
                (error) => {
                    // Login unsuccessful, display error message to the user
                    console.error('Error logging in:', error);
                    alert('Invalid credentials. Please try again.');
                }
            );
    }
}
