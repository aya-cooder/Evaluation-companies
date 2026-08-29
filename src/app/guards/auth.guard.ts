import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private toaster:ToastrService)   {}

  canActivate(): boolean {
    const token = localStorage.getItem('userToken');
    if (token) {
      return true; // User is authenticated
    } else {
      this.toaster.error("Please Login First!"); // Show toast message

      this.router.navigate(['/Home']); // Redirect to home or login page
      return false; // User is not authenticated
    }
  }
}
