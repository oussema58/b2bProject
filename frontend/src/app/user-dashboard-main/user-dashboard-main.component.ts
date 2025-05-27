import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardDto } from '../models/dashboardDto';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-dashboard-main',
  templateUrl: './user-dashboard-main.component.html',
  styleUrls: ['./user-dashboard-main.component.css']
})
export class UserDashboardMainComponent implements OnInit,OnDestroy {
  constructor(private storage:StorageService,private router:Router,private backend:BackendService,private toaster:ToastrService){

  }

  subscription1!:Subscription
  ngOnInit(): void {
   this.idClient=Number(this.storage.getUser()?.idClient)
   console.log("hi there")
   this.getDashboard()
  }
  dashboard!:DashboardDto
  idClient=0
  ready=false
  
  deconnecter(){
    this.storage.removeUser()
    this.router.navigate(['login'])
  }

  getDashboard(){
    this.subscription1=this.backend.getDashboardInfo().subscribe((data)=>{
      console.log(data.body)
      if(data.body!=null){
        this.dashboard=data.body
      }
    },(error)=>{

    },()=>{
      this.ready=true
    })
  }
  links:{src:string,img:string,value:string}[]=[]
  
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
    
  }
}
