import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
})
export class SignupComponent {
    visible: boolean = false;
    emp: string;
    password: string;
    name: string;
    conpass: any;
    adpass: any;

    constructor(private dataService: DataService, private router: Router) {}

    showDialog() {
        if (this.emp && this.name && this.password && this.conpass) {
            this.visible = true;
        } else {
            // If any field is empty, display an alert
            alert('Please enter all fields');
        }
    }

    signUp(): void {
        if (this.adpass !== 'admin') {
            // If admin password is incorrect, display an alert
            alert("Admin password is incorrect. Please enter the correct admin password.");
            return; // Stop further execution
        }

        // Check if passwords match
        if (this.password !== this.conpass) {
            // If passwords don't match, display an alert
            alert("Passwords do not match. Please make sure your passwords match.");
            return; // Stop further execution
        }

        // If all fields are filled and passwords match, proceed with signup
        const data = {
            emp: this.emp,
            name: this.name,
            password: this.password
        };

        this.dataService.signin(data).subscribe(
            (response) => {
                console.log('Data inserted successfully:', response);
                alert('Sign-up successful!');
                this.router.navigate(['/auth/gate']);
            },
            (error) => {
                console.error('Error inserting data:', error);
                alert('Sign-up failed: ' + error);
            }
        );
        this.router.navigate(["/auth/gate"]);

    }
}
