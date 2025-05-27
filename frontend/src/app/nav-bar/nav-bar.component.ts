import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private matDialog: MatDialog) {
  }
  openSignup() {
    let config: MatDialogConfig = new MatDialogConfig();
    config.width = "70%";
    this.matDialog.open(SignupComponent, config);
  }
  openLogin() {
    let config: MatDialogConfig = new MatDialogConfig();
    config.width = "60%";
    config.closeOnNavigation=true
    config.position={
      top: '20vh',
      left: '20%',
    }
    this.matDialog.open(LoginComponent, config);
  }
}
