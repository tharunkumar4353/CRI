import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from 'src/app/demo/service/data.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    emp: string;
    password: string;
    visible: boolean = false;
    adpass: any;
    emp1: string;
    password1: string;

    constructor(
        private http: HttpClient, 
        private dataService: DataService, 
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) { }

    showDialog() {
        this.visible = true;
    }

    loginad(): void {
        if (this.emp == 'admin' && this.password == 'admin') {
            this.router.navigate(["/"]).then(() => {
                this.refreshPage();
            });
        } else {
            alert("Invalid credentials");
        }
    }

    refreshPage(): void {
      window.location.reload();
  }

    change(): void {
        if (this.adpass !== 'admin') {
            alert("Admin password is incorrect. Please enter the correct admin password.");
            return;
        }

        if (!this.emp1 || !this.password1) {
            alert('Please enter both employee ID and new password.');
            return;
        }

        this.dataService.changepass(this.emp1, this.password1).subscribe(
            (response) => {
                if (response.success) {
                    console.log('Password changed successfully:', response);
                    alert('Password changed successfully!');
                    this.router.navigate(['/auth/gate']);
                } else {
                    alert('Employee ID not found. Please enter a valid employee ID.');
                }
            },
            (error) => {
                if (error.status === 404) {
                    alert('Employee ID not found. Please enter a valid employee ID.');
                } else {
                    console.error('Error changing password:', error);
                    alert('Failed to change password: ' + error.message);
                }
            }
        );
    }

    goToSignUp(): void {
        this.router.navigate(['/auth/signup']);
    }
}
