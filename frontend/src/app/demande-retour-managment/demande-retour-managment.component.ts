import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeRetour } from '../models/demandeRetour';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demande-retour-managment',
  templateUrl: './demande-retour-managment.component.html',
  styleUrls: ['./demande-retour-managment.component.css']
})
export class DemandeRetourManagmentComponent implements OnInit,OnDestroy {
  constructor(private renderer:Renderer2,private router:Router,
    private storage:StorageService,
    private backend:BackendService,private toaster:ToastrService){
  }
 
subscription1!:Subscription
subscription2!:Subscription
  filter="allDemandes"

  filterDemandesForClient(){
    console.log(this.filter)
   console.log(this.demandesRetourBackup)
   console.log(this.demandesRetour) 
this.demandesRetour=[]
if(this.filter=="mesDemandes"){
  //console.log("inside mes commandes")
for(let dr of this.demandesRetourBackup){
  if(dr.userCreatedBy.userName==this.username){
    this.demandesRetour.push(dr)
  } 
}
  }else if(this.filter=="allDemandes"){
    for(let o of this.demandesRetourBackup){
      this.demandesRetour.push(o)
  }
}
console.log(this.demandesRetour)
this.dataSource.data=this.demandesRetour

  }

clientId:any
role:any
intituleClient=""
username:any
dataSource!:MatTableDataSource<any>
@ViewChild(MatPaginator) paginator !: MatPaginator
displayedColumns:string[]=[]
displayedColumnsForAdmin=["commandeNum","client","nbrArticleRetenue","user","date creation","Info"]
displayedColumnsForClient=["commandeNum","nbrArticleRetenue","user","date creation","Info"]
/*searchFilter(demande:DemandeRetour){
if(this.intituleClient==""){
  this.demandesRetour.push(demande)
}else{
    this.demandesRetour=[]
    for(let demande of this.demandesRetourBackup){
      if(demande.client.intitule.toLocaleLowerCase().startsWith(this.intituleClient.toLocaleLowerCase()) ||
       demande.client.intitule.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleClient.toLocaleLowerCase()))){
        this.demandesRetour.push(demande)
      }
    }
  }
}*/

change(){
  if(this.intituleClient==""){
    this.demandesRetour=this.demandesRetourBackup
  }else{
    this.demandesRetour=[]
    for(let demande of this.demandesRetourBackup){
      if(demande.client.intitule.toLocaleLowerCase().startsWith(this.intituleClient.toLocaleLowerCase()) ||
       demande.client.intitule.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleClient.toLocaleLowerCase()))){
        this.demandesRetour.push(demande)
      }
    }
  }
  this.dataSource.data=this.demandesRetour
}
  ngOnInit(): void {
this.clientId=this.storage.getUser()?.idClient
console.log("id client dans demande managment")
console.log(this.clientId)
    this.role=this.storage.getUser()?.role
    this.username=this.storage.getUser()?.username
      
    if(this.role=="ADMIN"){
      this.displayedColumns=this.displayedColumnsForAdmin
this.getAllDemandeRetour()
    }else{
    this.getAllDemandeRetourByClient()
    this.displayedColumns=this.displayedColumnsForClient
  }
  }
  demandesRetour:DemandeRetour[]=[]
  demandesRetourBackup:DemandeRetour[]=[]

/*  updateStaus(id:number,status:string){
    this.backend.updateCommandStatus(id,status).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.commandes=data.body
      console.log(this.commandes)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      console.log("no problem")})
      this.getAllCommandes()
  }
  navigateToOpenDemandeRetour(commande:Commande){
    this.router.navigate(['dashboard/demandeRetour/add/'+commande.commandeId])
  }*/
  getAllDemandeRetour(){
 this.subscription1=this.backend.getAllDemandeRetour().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.demandesRetour=data.body
    console.log(this.demandesRetour)
    this.demandesRetour=this.demandesRetour.reverse()
    for(let o of this.demandesRetour){
      this.demandesRetourBackup.push(o)
}
    this.dataSource=new MatTableDataSource<any>(this.demandesRetour)
    this.dataSource.paginator=this.paginator
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{
    console.log("no problem")})
}
getAllDemandeRetourByClient(){
  this.subscription2=this.backend.getAllDemandeRetourByClient(this.clientId).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.demandesRetour=data.body
      console.log(this.demandesRetour)
      this.demandesRetourBackup=this.demandesRetour.reverse()
      this.dataSource=new MatTableDataSource<any>(this.demandesRetour)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      console.log("no problem")})
      this.demandesRetourBackup=[]
      for(let o of this.demandesRetour){
        this.demandesRetourBackup.push(o)
  }
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
