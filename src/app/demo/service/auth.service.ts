import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private role: string | null = null;

    constructor(private router: Router) { }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('authToken');
    }

    login(token: string) {
        localStorage.setItem('authToken', token);
        if (token === 'adminToken') {
            this.role = 'admin';
        } else if (token === 'employeeToken') {
            this.role = 'employee';
        }
        localStorage.setItem('userRole', this.role);
    }

    getRole(): string | null {
        if (!this.role) {
            this.role = localStorage.getItem('userRole');
        }
        return this.role;
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        this.router.navigate(['/auth/gate']);
        this.role = null;
    }

    private selectedMachine: any;

    setSelectedMachine(machine: any): void {
        this.selectedMachine = machine;
    }

    getSelectedMachine(): any {
        return this.selectedMachine;
    }

}
