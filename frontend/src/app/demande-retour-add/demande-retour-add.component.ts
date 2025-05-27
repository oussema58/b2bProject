import { Component, OnDestroy, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Commande } from '../models/Commande';
import { Motif } from '../models/motif';
import { DemandeRetourDto } from '../models/demandeRetourDto';
import { CommandLigne } from '../models/CommandLigne';
import { LigneDemandeRetourDto } from '../models/ligneDemandeRetourDto';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demande-retour-add',
  templateUrl: './demande-retour-add.component.html',
  styleUrls: ['./demande-retour-add.component.css']
})
export class DemandeRetourAddComponent implements OnDestroy {
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private router:Router,private toaster:ToastrService){
  
  }
readonly LIVREE="Livree"
  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  orderId:any
  // commande!:Commande
  commande:any
  motifs:Motif[]=[]
  demandeRetour!:DemandeRetourDto
  dataSource!:MatTableDataSource<any>
  displayedColumns=["ligne num","code","Intitule","quantite","ARetourner","motif","nbrArtcileAretoutner"]
  clientId:any
  ngOnInit(): void {
    this.clientId=this.storageService.getUser()?.idClient
    this.activated.paramMap.subscribe((params)=>{
  this.orderId=params.get("orderId")
  console.log(this.orderId)
  this.getCommandeById(this.orderId)
    }
    )
    this.getMotifs()
      }
      getMotifs(){
      this.subscription1=this.backend.getAllMotifs().subscribe((data)=>{
          console.log(data.status)
          if(data.body!=null){
          this.motifs=data.body
          console.log(this.motifs)
        }},(error)=>{
          console.log(error.status)
        console.log(error.error)
        },()=>{console.log("no problem")})
      }
      getCommandeById(id:number){
        this.subscription2=this.backend.getCommandeById(id).subscribe((data)=>{
          console.log(data.status)
          if(data.body!=null){
          this.commande=data.body
          console.log(this.commande)
          if(this.commande.clientId!=this.clientId){
            this.toaster.error("tu ne peut pas accéder a cette commande")
            this.router.navigate(["/notFound"])
            return
          }
          if(this.commande.statut.statustIntitule!=this.LIVREE){
            this.toaster.error("commande en cours de traitement il n'est pas livree")
            this.router.navigate(["/unauthorized"])
            return
          }
          if(this.commande.demandeRetour!=null){
            this.toaster.error("demande retour deja crée pour cette commande")
            this.router.navigate(["/unauthorized"])
            return
          }
        }},(error)=>{
          console.log(error.status)
        console.log(error.error)
        if(error.status==404){
          this.router.navigate(["/notFound"])
        }
        },()=>{
          console.log("no problem")
        this.demandeRetourPreparation(this.commande)
        })
      }
      updateDemandeRetour(ligne:LigneDemandeRetourDto){
       if(!ligne.checked){
        ligne.nbArticleRetenue=0
        ligne.motidId=0
       }
       console.log(ligne)
      }
      demandeRetourPreparation(commande:Commande){
        let lignesRetour:LigneDemandeRetourDto[]=[]
        for(let ligne of commande.lignes){
          let retour =new LigneDemandeRetourDto(0,0,ligne.ligneId,ligne.articleCode,ligne.articleIntitule,ligne.ligneQuantite,false)
          lignesRetour.push(retour)

        }
        let username:any=this.storageService.getUser()?.username
        this.demandeRetour=new DemandeRetourDto(lignesRetour,username,commande.commandeId)
        this.dataSource=new MatTableDataSource<any>(lignesRetour)
        
      }
      addDemandeRetour(){
        
  let lignes =this.demandeRetour.lignes.filter((ligne)=>ligne.checked)
  this.demandeRetour.lignes=lignes
  console.log(lignes)
  console.log(lignes.length)
  if(lignes.length==0){
    this.toaster.error("choisir quels sont les articles a retoruner","Terminé avec echec")
    return ;
  }
  for(let ligne of lignes){
    if(ligne.nbArticleRetenue==0){
      this.toaster.error("chaque article choisie a etre retourne son nombre de retour doit etre superieur a 0","Terminé avec echec")
      return;
    }
    if(ligne.nbArticleRetenue<0 || ligne.nbArticleRetenue>ligne.ligneQuantite){
      this.toaster.error("verifier le quantite d'article retoruné pour les lignes","Terminé avec echec")
      return ;
    }
    if(ligne.motidId==0){
      this.toaster.error("verifier que chaque ligne de retour contient un motif","Terminé avec echec")
      return;
    }
  }
  console.log(this.demandeRetour)
  
  this.subscription3=this.backend.addDemandeRetour(this.demandeRetour).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
      console.log(data.body)
      this.toaster.success(data.body.message,"Terminé avec succées",{disableTimeOut:true})
    }
  },(error)=>{
    console.log(console.log(error))
    console.log(error.error)
    this.toaster.error(error.error,"Terminé avec echec")
  this.getCommandeById(this.orderId)
  },()=>{this.router.navigate(["client/dashboard/demandeRetour"])}

    )
    
  }
  annuler(){
    for(let ligne of this.demandeRetour.lignes){
      ligne.checked=false
      ligne.motidId=0
      ligne.nbArticleRetenue=0
  }
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

