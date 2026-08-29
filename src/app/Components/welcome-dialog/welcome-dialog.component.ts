import { Component ,Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.css'
})
export class WelcomeDialogComponent {
  firstName: string;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<WelcomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstName = data.firstName;
  }

  navigateToRegister() {
    this.dialogRef.close();
    this.router.navigate(['register']);
  }

  navigateToDashboard() {
    this.dialogRef.close();
    this.router.navigate(['DashBoard']);
  }
  onClose() {
    this.dialogRef.close(); // إغلاق الـ dialog عند النقر على الأيقونة
  }

}
