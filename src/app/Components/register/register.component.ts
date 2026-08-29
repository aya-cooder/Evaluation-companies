import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

import { WelcomeDialogRegisterComponent } from '../welcome-dialog-register/welcome-dialog-register.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isPasswordVisible: boolean = false;
  faEye = faEye; 
  faEyeSlash = faEyeSlash;
  requestTypes = [
    { label: 'None', value: '' },
    { label: 'بيرفكت سيرفاى', value: 45 },
    { label: 'إسبكترم', value: 46 },
    { label: 'الجيزة', value: 47 },
    { label: 'الماسة', value: 48 },
    { label: 'جيومكانى', value: 49 },
    { label: 'ماستر سيرفاى', value: 50 },
    { label: 'ايدج برو', value: 51 },
    { label: 'سيفل كاد', value: 52 },
    { label: 'المصرية الكويتية', value: 53 },
    { label: 'انفو فاكت', value: 54 },
    { label: 'هاى ليفل', value: 55 },
    { label: 'زون سيرفاي', value: 56 },
    { label: 'MSD', value: 57 },
    { label: 'الصفا سيرفاى', value: 60 },
    { label: 'الاستشارى سيرفاى', value: 61 },
    { label: 'بريسيشن سيرفاى', value: 62 },
    { label: 'بي ام سي سيرفاي', value: 63 },
    { label: 'جيوسكيل', value: 64 },
    { label: 'عمارنه للمقاولات', value: 65 },
    { label: 'النقيب', value: 66 },
    { label: 'وايز جروب', value: 67 },
    { label: 'هندسه البناء', value: 68 },
    { label: 'المستقبل', value: 69 },
    { label: 'الصفا للمقاولات', value: 70 },
    { label: 'المجد', value: 72 },
    { label: 'اليمامة', value: 74 },
    { label: 'المصرية للخدمات', value: 76 },
    { label: 'انيكس', value: 79 },
    { label: 'المصرية المساحة', value: 80 },
    { label: 'بروكسيما', value: 81 },
    { label: 'تشاري البحر الاحمر', value: 84 },
    { label: 'فيرتكس', value: 86 },
    { label: 'ام جى اى اس', value: 88 },
    { label: 'الطلبات المستردة', value: 89 },
    { label: 'الكريم للمقاولات', value: 99 }
  ];

  register: FormGroup = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    companyId: new FormControl(null, Validators.required),
    role: new FormControl(null, Validators.required)
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  registerSubmit() {
    if (this.register.valid) {
      this._AuthService.getRegister(this.register.value).subscribe({
        next: (res) => {
          console.log(res);
          this.toastr.success('تم انشاء الحساب بنجاح !', 'Success', { positionClass: 'toast-top-center' });
          this.showWelcomeMessage(); // Show dialog after successful registration
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
  
          // Extract error messages from the response
          if (err.error?.errors?.length > 0) {
            const errorMessage = err.error.errors.join('<br>'); // Join messages with line breaks
            this.toastr.error(errorMessage, 'Error', { disableTimeOut: true, enableHtml: true , positionClass: 'toast-top-center'  }); // Use enableHtml to display messages with formatting
          } else {
            this.toastr.error('حدث خطأ أثناء التسجيل.', 'Error', { disableTimeOut: true });
          }
        }
      });
    } else {
      this.register.markAllAsTouched();
    }
  }
  
  showWelcomeMessage() {
    const dialogRef = this.dialog.open(WelcomeDialogRegisterComponent, {
      disableClose: true,
      data: { firstName: this.register.get('firstName')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'goToDashboard') {
        this._Router.navigate(['DashBoard']);
      }
      // else, stay on the register page
    });
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
