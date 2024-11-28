import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Replace 'token' with your key if different
    if (token) {
      return true; // Allow navigation to the route
    } else {
      this.router.navigate(['/login']); // Redirect to login
      return false; // Block navigation
    }
  }
}
