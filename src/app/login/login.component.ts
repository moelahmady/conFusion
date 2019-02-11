import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = { username: '', password: '', remember: false };
  constructor(public dialogRef: MatDialogRef<LoginComponent>, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('User: ', this.user);

    if (this.user.username && this.user.password) {
      this.authService.login(this.user.username, this.user.password)
        .subscribe(
          () => {
            console.log("User is logged in");
            this.dialogRef.close();
          }
        );
    }
  }
}

