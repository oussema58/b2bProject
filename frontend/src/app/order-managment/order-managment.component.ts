import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { FormBuilder } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Commande } from '../models/Commande';
import { CommandeDto2 } from '../models/commandeDto2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CommandeLivraisonDateComponent } from '../commande-livraison-date/commande-livraison-date.component';
import { updateCommandeDto } from '../models/updateCommandeDto';

@Component({
  selector: 'app-order-managment',
  templateUrl: './order-managment.component.html',
  styleUrls: ['./order-managment.component.css']
})
export class OrderManagmentComponent implements OnInit,OnDestroy{
  constructor(private renderer:Renderer2,private router:Router,
    private storage:StorageService,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog){
  }

  subscription1:any
  subscription2:any
  subscription3:any
  subscription4:any
  filter="allCommandes"
  filterOrders(){
    console.log(this.filter)
   console.log(this.commandesBackup)
   console.log(this.commandes) 
this.commandes=[]
if(this.filter=="mesCommandes"){
  //console.log("inside mes commandes")
for(let o of this.commandesBackup){
  /*console.log("commande username")
  console.log(o.userCreate.userName)*/
  if(o.userCreate.userName==this.username){
    this.commandes.push(o)
  } 
}
  }else if(this.filter=="allCommandes"){
    for(let o of this.commandesBackup){
        this.commandes.push(o)
  }
}
console.log(this.commandes)
this.dataSource.data=this.commandes

  }



dialogResult=false
clientId:any
role:any
intituleOrder=""
username:any
readonly refuse="REFUSE"
readonly accepter="VALIDE"
readonly created="CREE"
readonly livree="Livree"
userId:any
  ngOnInit(): void {
this.clientId=Number(this.storage.getUser()?.idClient)
    this.role=this.storage.getUser()?.role
    this.username=this.storage.getUser()?.username
    if(this.role=="ADMIN"){
      this.displayedColumns=this.displayedColumnsForAdmin
this.getAllCommandes()
    }else{
      this.displayedColumns=this.displayedColumnsForClient
    this.getAllCommandesByClient()
  }
  }
  commandes:any=[]
  commandesBackup:any=[]
  dataSource!:MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns:any=[]
  displayedColumnsForAdmin=["Code","nb Articles","total ttc","statut","date creation","Client","User","Action"]
  displayedColumnsForClient=["Code","nb Articles","total ttc","statut","date creation","User","Action"]

  updateStaus(id:number,status:string){
    if(status==this.accepter){
    let ref=this.matDialog.open(CommandeLivraisonDateComponent,{width:"80%",data:id})
    ref.afterClosed().subscribe((data)=>{
      
    this.getAllCommandes()
    }
  )
}else{
  let body:updateCommandeDto=new updateCommandeDto(this.refuse)
    this.subscription4=this.backend.updateCommandStatus(id,body).subscribe((data)=>{
       console.log(data.status)
       if(data.body!=null){
       //this.commandes=data.body.reverse()
       this.toaster.success("commande "+this.refuse,"Traitement fait avec succées",{disableTimeOut:true})
       
     }},(error)=>{
       console.log(error.status)
     console.log(error.error)
     },()=>{
       console.log("no problem")})
       this.getAllCommandes()
   }
}
      
   

/*updateStaus(id:number,status:string){
   this.subscription1=this.backend.updateCommandStatus(id,status).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      //this.commandes=data.body.reverse()
      this.toaster.success("commande "+status,"Traitement fait avec succées",{disableTimeOut:true})
      console.log(this.commandes)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      console.log("no problem")})
      this.getAllCommandes()
  }*/







  /*updateStaus(id:number,status:string){
    this.subscription1=this.backend.updateCommandStatus(id,status).subscribe((data)=>{
       console.log(data.status)
       if(data.body!=null){
       //this.commandes=data.body.reverse()
       this.toaster.success(data.body,"Traitement fait avec succées",{disableTimeOut:true})
       console.log(this.commandes)
     }},(error)=>{
       console.log(error.status)
     console.log(error.error)
     },()=>{
       console.log("no problem")})
       this.getAllCommandes()
   }*/
  navigateToOpenDemandeRetour(commande:Commande){
    this.router.navigate(['client/dashboard/demandeRetour/add/'+commande.commandeId])
  }
  /*
diplayIntituleRequired=false
intituleValidator(){
  console.log("wait i am checking")
if(this.intitule==""){
  this.diplayIntituleRequired=true
}else{
  this.diplayIntituleRequired=false
}

}
*/
getAllCommandes(){
  this.subscription2=this.backend.getAllCommandes().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.commandes=data.body.reverse()
    console.log(this.commandes)
    // this.commandes=[]


    this.dataSource=new MatTableDataSource<any>(this.commandes)
      this.dataSource.paginator=this.paginator
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{
    console.log("no problem")
    
  //this.commandes=this.commandesBackup
  })
}
  getAllCommandesByClient(){
   this.subscription3=this.backend.getAllCommandesByClient(this.clientId).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.commandes=data.body
      console.log(this.commandes)
      this.dataSource=new MatTableDataSource<any>(this.commandes)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      console.log("no problem")
      this.commandesBackup=[]
      for(let o of this.commandes){
        this.commandesBackup.push(o)
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
    
  }
  
}
