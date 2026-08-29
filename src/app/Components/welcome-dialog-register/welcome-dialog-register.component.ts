import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-dialog-register',
  templateUrl: './welcome-dialog-register.component.html',
  styleUrls: ['./welcome-dialog-register.component.css']
})
export class WelcomeDialogRegisterComponent {
  firstName: string;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<WelcomeDialogRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.firstName = data.firstName;
  }

  navigateToRegister() {
    this.dialogRef.close('stayOnRegister');
    window.location.reload();
  }

  navigateToDashboard() {
    this.dialogRef.close('goToDashboard');
    this.router.navigate(['DashBoard']);

  }

  onClose() {
    this.dialogRef.close(); // Close the dialog
  }
}
