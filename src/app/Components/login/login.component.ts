import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';
import { WelcomeDialogComponent } from '../welcome-dialog/welcome-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  Error: boolean = false;

  faEye = faEye; 
  faEyeSlash = faEyeSlash;

  login: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(private _AuthService: AuthService, private _Router: Router, private dialog: MatDialog) {}

  loginSubmit() {
    if (this.login.invalid) return;

    this._AuthService.sendlogin(this.login.value).subscribe({
      next: (res) => {
        console.log('Response:', res); // تحقق من محتوى الـ response
        localStorage.setItem("userToken", res.token);
        localStorage.setItem("userRoles", JSON.stringify(res.roles)); // حفظ الأدوار
        console.log("Roles saved to localStorage:", localStorage.getItem("userRoles"));
        this._AuthService.companyId.next(res.companyUserID);
        localStorage.setItem('companyId', res.companyUserID);

        // تحقق من وجود الدور "admin" ضمن مصفوفة الأدوار
        if (res.roles && res.roles.includes('admin')) {
          console.log('Showing welcome message for admin');
          this.showWelcomeMessage(res.username);
        } else {
          console.log('Navigating to Dashboard');
          this._Router.navigate(['DashBoard']);
        }
      },
      error: (err) => {
        console.log(err);
        this.Error = true; 
      }
    });
  }

  showWelcomeMessage(firstName: string) {
    this.dialog.open(WelcomeDialogComponent, {
      data: { firstName: firstName },
      disableClose: true // جعل الـ dialog غير قابل للإغلاق بالنقر خارجياً
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
