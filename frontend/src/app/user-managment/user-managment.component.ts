import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Client } from '../models/client';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateClientComponent } from '../update-client/update-client.component';
import { DeleteClientComponent } from '../delete-client/delete-client.component';
import { SignupComponent } from '../signup/signup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { StorageService } from '../services/storage.service';
import { UserAddComponent } from '../user-add/user-add.component';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit,OnDestroy{
constructor(private backend:BackendService,private formBuilder:FormBuilder,
  private activated:ActivatedRoute,private matDialog:MatDialog,private storageService:StorageService
  ,private toaster:ToastrService,private router:Router){

}
 
subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
subscription4!:Subscription
defaultImage="assets/images/avatar/account.png"
dataSource!:MatTableDataSource<any>
@ViewChild(MatPaginator) paginator !: MatPaginator
//displayedColumns:string[]=["image","Nom","Nom Utilisateur","Email","Nb_Commande","Telephone","date creation","Action"]
displayedColumns:string[]=["image","Nom","Nom Utilisateur","Email","Telephone","date creation","Action"]
users:User[]=[]
usersBackup:User[]=[]
intituleUser=""
clientId:any
username=this.storageService.getUser()?.username

role:any
idClient:any
filter="tout"
changeUsers(){
  this.users=[]
  console.log(this.users)
  if(this.filter=="tout"){
  for(let u of this.usersBackup){
    this.users.push(u)
  }
}else{
  for(let u of this.usersBackup){
    if(u.role=="SUPER_CLIENT"){
    this.users.push(u)
    break
  }
  }
}
this.dataSource.data=this.users
console.log(this.users)
}


bloquer(username:string){
 this.subscription1=this.backend.blockUser(username).subscribe({next:(data)=>{
    console.log("Society is being blocked ...")
    this.toaster.success("Terminé avec succées",data.message,{disableTimeOut:true})
  },error:(error)=>{console.log(error)
    console.log(error.error)
    this.toaster.error("Terminé avec echec",error.error)},
  complete:()=>{
    this.getUsers(this.clientId)
    
  }})
}

debloquer(username:string){
  this.subscription2=this.backend.unblockUser(username).subscribe({next:(data)=>{
    console.log("Society is getting unblocked...")
    this.toaster.success("Terminé avec succées",data.message,{disableTimeOut:true})
  },error:(error)=>{console.log(error)
    console.log(error.error)
    this.toaster.error("Terminé avec echec",error.error)},
  complete:()=>{
    this.getUsers(this.clientId)
  }})
}


ngOnInit(): void {
  this.idClient=this.storageService.getUser()?.idClient
  this.activated.paramMap.subscribe((params)=>{
this.clientId=params.get("clientId")
console.log("client id in route "+this.clientId)
this.getUsers(this.clientId)
this.role=this.storageService.getUser()?.role
  })
    }

    change(){
      if(this.intituleUser==""){
        this.users=this.usersBackup
      }else{
        this.users=[]
        for(let user of this.usersBackup){
          if(user.name.toLocaleLowerCase().startsWith(this.intituleUser.toLocaleLowerCase()) ||
           user.name.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleUser.toLocaleLowerCase()))){
            this.users.push(user)
          }
        }
      }
      this.dataSource.data=this.users
    } 
  getUsers(id:Number){
this.subscription3=this.backend.getUsersByClient(id).subscribe((data)=>{
  console.log(data.status)
  if(data.body!=null){
    this.users=data.body.reverse()
    // this.users=[]
    /*this.toaster.success("compte client supprimé avec succées","Terminé avec succées",{disableTimeOut:true})*/
    console.log(this.users)
    this.usersBackup=this.users.filter((u)=>u.userName!=this.username)
    this.users=[]
    for(let u of this.usersBackup){
      this.users.push(u)
    }
    if(this.role!="ADMIN"){
      if(this.clientId!=this.idClient){
        this.router.navigate(["/notFound"])
      }
    }
    this.dataSource=new MatTableDataSource<any>(this.users)
      this.dataSource.paginator=this.paginator

  }
},(error)=>{
console.log(error.status)
console.log(error.error)
if(error.status==404){
  this.router.navigate(["/notFound"])
}
},()=>{
 
}
)
  }

      openEdit(user:User){
    let matRef=this.matDialog.open(UserUpdateComponent,{
      width:"80%",data:user
    }
    )
    matRef.afterClosed().subscribe((res)=>{
      console.log("inside observable of update user closed")
      console.log(res)
      if(res){
    this.getUsers(this.clientId)
    }
    })
      }
    delete(id:string){
      this.subscription4=this.backend.deleteUser(id).subscribe((data)=>{
        console.log(data)
        this.toaster.success(data.body.message,"Terminé avec succées",{disableTimeOut:true})
            },(error)=>{
              console.log(error)
              console.log(error.error)
              this.toaster.error(error.error,"Terminé avec echec")
            },()=>{console.log("everything went fine")
          this.getUsers(this.clientId)
          
          this.getUsers(this.clientId)
          })
    }
    openCreate(){
      let matRef=this.matDialog.open(UserAddComponent,{
        width:"80%",data:this.clientId
      }
      )
      matRef.afterClosed().subscribe((res)=>{
        console.log("inside observable of update user closed")
        console.log(res)
        if(res){
      this.getUsers(this.clientId)
      }
      })
    }
    ngOnDestroy(): void {
      if(this.subscription1){
        this.subscription1.unsubscribe()
      }
      if(this.subscription2){
        this.subscription2.unsubscribe()
      }
      if(this.subscription3){
        this.subscription3.unsubscribe()
      }
      if(this.subscription4){
        this.subscription4.unsubscribe()
      }

    }
}
