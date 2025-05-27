import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../models/user';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { UserDto } from '../models/userDto';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private matDialog:MatDialog,private router:Router){
  
  }

  subscription1!:Subscription
  subscription2!:Subscription
  data:any
  role:any
  idUser:any
  user!:UserDto
  clientId:any
  //@Input()
  idClient:any
  ngOnInit(): void {
    this.activated.parent?.paramMap.subscribe((params)=>{
      this.idClient=params.get("clientId")
    });
    this.activated.paramMap.subscribe((params)=>{
  this.idUser=params.get("userId")
  
  console.log(this.idUser)
  this.getUser()
    })
   this.role=this.storageService.getUser()?.role
   this.clientId=this.storageService.getUser()?.idClient
   console.log("id client in route " +this.idClient)
   console.log(this.role)
      }
    getUser(){
      this.subscription1=this.backend.getUserById(this.idUser).subscribe((data)=>{
        console.log(data)
  if(data.body!=null){
console.log(data)
console.log(data.body)
  this.user=data.body
  if(this.user.idClient!=this.idClient ){
    this.router.navigate(["/notFound"])
  }
  console.log("id client in route " +this.idClient)
  if(this.role!='ADMIN'){
    if(this.user.idClient!=this.clientId){
      this.router.navigate(["/notFound"])
    }
  }
  }
      },(error)=>{
        console.log(error.status)
        console.log(error.error)
        if(error.status==404){
          this.router.navigate(["/notFound"])
        }
        })
    }
  openUpdate(user:UserDto){
    let matRef=this.matDialog.open(UserUpdateComponent,{
      width:"80%",data:new User(user.id,user.name,user.etat,user.creationDate,user.userName,user.email,user.phoneNumber)
    }
    )
    matRef.afterClosed().subscribe((res)=>{
      console.log("inside observable of after closed")
      console.log(res)
      if(res){
    this.getUser()
    }
    })
      }
      delete(id:string){
        this.subscription2=this.backend.deleteUser(id).subscribe((data)=>{
    console.log(data)
        },(error)=>{
          console.log(error)
          console.log(error.error)
        },()=>{console.log("everything went fine")
      this.router.navigate(["/dashboard/client/"+this.user.idClient+"/user/group/1"])
      })
        
      }
      ngOnDestroy(): void {
        if(this.subscription1){
          this.subscription1.unsubscribe()
        }
        if(this.subscription2){
          this.subscription2.unsubscribe()
        }
       
      }
  }
