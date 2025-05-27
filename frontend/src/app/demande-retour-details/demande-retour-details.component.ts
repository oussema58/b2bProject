import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { DemandeRetour } from '../models/demandeRetour';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LigneDemandeRetour } from '../models/ligneDemandeRetour';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demande-retour-details',
  templateUrl: './demande-retour-details.component.html',
  styleUrls: ['./demande-retour-details.component.css']
})
export class DemandeRetourDetailsComponent implements OnInit,OnDestroy {
  constructor(private renderer:Renderer2,private router:Router,
    private storage:StorageService,
    private backend:BackendService,private toaster:ToastrService,private activated:ActivatedRoute){
  }

//dialogResult=false
subscription1!:Subscription
demandeRetourId:any
role:any
clientId:any
intituleArticle=""
dataSource!:MatTableDataSource<any>
@ViewChild(MatPaginator) paginator !: MatPaginator
displayedColumns:string[]=["ligneRetour","articleIntitule","article code","motif","nbrArticleTotale","nbrArticleRetenue"]
  ngOnInit(): void {
    this.clientId=this.storage.getUser()?.idClient
    this.role=this.storage.getUser()?.role
    this.activated.paramMap.subscribe((params)=>{
      this.demandeRetourId=params.get("idDemandeRetour")
      console.log(this.demandeRetourId)
      
this.getDemandeRetourById(this.demandeRetourId)
  
  })
  }
  demandeRetour!:DemandeRetour
  lignesDemandeRetour:LigneDemandeRetour[]=[]
  lignesDemandeRetourBackup:LigneDemandeRetour[]=[]
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
  getDemandeRetourById(id:number){
  this.subscription1=this.backend.getDemandeRetourById(id).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.demandeRetour=data.body
    this.lignesDemandeRetour=this.demandeRetour.lignes
    this.lignesDemandeRetourBackup=this.lignesDemandeRetour
    if(this.role!="ADMIN"){
      if(this.demandeRetour.clientId!=this.clientId){
        this.router.navigate(["/notFound"])
      }
    }
    this.dataSource=new MatTableDataSource<any>(this.lignesDemandeRetour)
    this.dataSource.paginator=this.paginator
    console.log(this.demandeRetour)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  if(error.error=="aucun demande avec cette id"){
    this.router.navigate(["/notFound"])
  }
},()=>{
    console.log("no problem")})
}
change(){
  if(this.intituleArticle==""){
    this.lignesDemandeRetour=this.lignesDemandeRetourBackup
  }else{
    this.lignesDemandeRetour=[]
    for(let ligne of this.lignesDemandeRetourBackup){
      if(ligne.artcileIntitule.toLocaleLowerCase().startsWith(this.intituleArticle.toLocaleLowerCase()) ||
       ligne.artcileIntitule.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleArticle.toLocaleLowerCase()))){
        this.lignesDemandeRetour.push(ligne)
      }
    }
  }
  this.dataSource.data=this.lignesDemandeRetour
}
ngOnDestroy(): void {
  if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  
}
}
