import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '../models/client';
import { UpdateClientComponent } from '../update-client/update-client.component';
import { DeleteClientComponent } from '../delete-client/delete-client.component';
import { SignupComponent } from '../signup/signup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatNoDataRow } from '@angular/material/table';
@Component({
  selector: 'app-client-managment',
  templateUrl: './client-managment.component.html',
  styleUrls: ['./client-managment.component.css']
})
export class ClientManagmentComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private formBuilder:FormBuilder,
    private matDialog:MatDialog,private router:Router,private activated:ActivatedRoute,private toaster:ToastrService){
  
  }
subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
subscription4!:Subscription
  defaultImage="assets/images/avatar/societe.jpg"
  clients:Client[]=[]
  clientBackup:Client[]=[]
  /*nbClientByLigne=5
  nbGroup=1*/
  intituleSociete=""
  dataSource!:MatTableDataSource<Client>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  //displayedColumns=["Code","Intitule","Matricule Fiscale","Telephone","email","Nb_Commande","Created By","Action"]
  displayedColumns=["image","Code","Intitule","Matricule Fiscale","Telephone","email","Created By","Action"]
  getClients(){ 
    this.subscription1=this.backend.getClients().subscribe((data)=>{
      console.log(data.status)
      console.log(data.body)
      if(data.body!=null){
        this.clients=data.body.reverse()
        // this.clients=[]
        this.dataSource=new MatTableDataSource<Client>(this.clients)
        this.dataSource.paginator=this.paginator
      }
      },(error)=>{
        console.log(error)
      console.log(error.error)
      },()=>{
      this.clientBackup=this.clients
}
      )
    }
    ngOnInit(): void {
    this.getClients()
  }
  change(){
    if(this.intituleSociete==""){
      this.clients=this.clientBackup
    }else{
      this.clients=[]
      for(let client of this.clientBackup){
        if(client.intitule.toLocaleLowerCase().startsWith(this.intituleSociete.toLocaleLowerCase()) ||
         client.intitule.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleSociete.toLocaleLowerCase()))){
          this.clients.push(client)
        }
      }
    }
    this.dataSource.data=this.clients
  }
    details(id:Number){
  this.router.navigate(["user-managment/"+id])
    }
    openUpdate(client:Client){
  let matRef=this.matDialog.open(UpdateClientComponent,{
    width:"80%",data:client
  }
  )
  matRef.afterClosed().subscribe((res)=>{
    console.log("inside observable of after closed")
    console.log(res)
    if(res){
  this.getClients()
  }
  })
    }
  delete(id:number){
    this.subscription2=this.backend.deleteClient(id).subscribe((data)=>{
console.log(data)
this.toaster.success("société est supprimée ","Terminé avec succées")
    },(error)=>{
      console.log(error)
      console.log(error.error)
      this.toaster.error("Terminé avec echec",error.body.message)
    },()=>{console.log("everything went fine")
  this.getClients()

  })
    
  }
  openSignup(){
   let matRef= this.matDialog.open(SignupComponent,{
      width:"80%"
    })
  matRef.afterClosed().subscribe((result)=>{
    if(result){
      this.getClients()
    }
  })
  }

  bloquer(id:number){
    this.subscription3=this.backend.blockClient(id).subscribe({next:(data)=>{
      console.log("Society is being blocked ...")
      this.toaster.success(data.message,"Terminé avec succées")
    },error:(error)=>{console.log(error)
      console.log(error.error)
      this.toaster.error("Terminé avec echec",error.error)},
    complete:()=>{
      this.getClients()
    }})
  }

  debloquer(id:number){
    this.subscription4=this.backend.unblockClient(id).subscribe({next:(data)=>{
      console.log("Society is getting unblocked...")
      this.toaster.success(data.message,"Terminé avec succées")
    },error:(error)=>{console.log(error)
      console.log(error.error)
      this.toaster.error(error.error,"Terminé avec echec")},
    complete:()=>{
      this.getClients()
    }})
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
