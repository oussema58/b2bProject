import { Component, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent {
constructor(private storage:StorageService,private router:Router){

}
deconnecter(){
  this.storage.removeUser()
  this.router.navigate(['login'])
}
clientId=this.storage.getUser()?.idClient
}
