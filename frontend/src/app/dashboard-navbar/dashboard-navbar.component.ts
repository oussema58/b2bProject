import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { UserDto } from '../models/userDto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit,OnDestroy  {
  constructor(private storage:StorageService,private router:Router,private backend:BackendService){

  }
subscription1!:Subscription
  defaultImage="assets/images/avatar/account.png"
  ngOnInit(): void {
   this.getUser()
  }
  user!:UserDto
  deconnecter(){
    this.storage.removeUser()
    this.router.navigate(['login'])
  }
  
  getUser(){
 this.subscription1=this.subscription1=this.backend.getUser().subscribe((data)=>{
      console.log(data.body)
      if(data.body!=null){
        this.user=data.body
      }
    },(error)=>{
      console.log("problem occured while fetching")
    })
  }
  ngOnDestroy(): void {
    if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  }

}
