import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommandLigne } from '../models/CommandLigne';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { LignePanierDto } from '../models/LignePanierDto';
import { LignePanier } from '../models/LignePanier';
import { Subscription } from 'rxjs';
import { ComponentCommunicator } from '../services/componentCommunicator.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
  /*eha baad na*/
  ,encapsulation:ViewEncapsulation.ShadowDom
})
export class CartModalComponent implements OnInit,OnDestroy{
  constructor(private backend:BackendService,
    private ref:MatDialogRef<CartModalComponent>,
    private storageService:StorageService,private router:Router,
    //@Inject(MAT_DIALOG_DATA)public lignes:CommandLigne[]
    @Inject(MAT_DIALOG_DATA)public lignes:LignePanierDto[],
    private panierCommunicator:ComponentCommunicator
    ){

  }

  data:any
 subscription1!:Subscription
 subscription2!:Subscription
 subscription3!:Subscription
  updateLignePanier(ligne:LignePanierDto,quantity:number){
   this.subscription1=this.backend.updateLignePanier(ligne.id,quantity).subscribe({next:(data)=>{
      ligne=data
      console.log(data)
      console.log(ligne)
      console.log("ligne is updated")
    },error:(error)=>{console.log(error)
      console.log(error.error)
    },complete:()=>{
    console.log("everything done")
 // this.getAllCommandLignes()
this.getAllLignePanier()
  }
    
    })
  }
/*updatePanierLignes(){
  let panierToStore:LignePanier[]=[]
  for(let item of this.lignes){
    let ligne=new LignePanier(item.articleId,item.ligneQuantite,this.username)
    panierToStore.push(ligne)
  }
      this.backend.addAllLignePanier(panierToStore).subscribe((data)=>{
        console.log(data.status)
        if(data.body!=null){
        console.log(data)
        
      }},(error)=>{
        console.log(error.status)
      console.log(error.error)
     
      },()=>{
        console.log("no problem")
        this.panierCommunicator.emitEvent()
      this.navigate()
    }) 
}*/

  /*updateLignePanier(ligne:LignePanierDto,quantity:number){
    this.backend.updateLignePanier(ligne.id,quantity).subscribe({next:(data)=>{
      ligne=data
      console.log(data)
      console.log(ligne)
      console.log("ligne is updated")
    },error:(error)=>{console.log(error)
      console.log(error.error)
    },complete:()=>{
    console.log("everything done")
 // this.getAllCommandLignes()
this.getAllLignePanier()
  }
    
    })
  }*/
/*  changeValue(ligne:LignePanierDto,input:any){
    console.log("blur event")
    console.log(ligne)
    if(!Number.isInteger(Number.parseInt(input.value)) || input.value<=0){
      input.value=ligne.ligneQuantite
    }else{
      ligne.ligneQuantite=input.value
      ligne.ligneTotalTtc=ligne.tarifttc*ligne.ligneQuantite

      this.subtotalUpdate()
      
    }*/
    changeValue(ligne:LignePanierDto,input:any){
      console.log("blur event")
      console.log(ligne)
      if(!Number.isInteger(Number.parseInt(input.value)) || input.value<=0){
        input.value=ligne.ligneQuantite
      }else{
        if(input.value!=ligne.ligneQuantite){
          ligne.ligneQuantite=input.value
          console.log(ligne.id)
        this.updateLignePanier(ligne,input.value)
      }  
        this.subtotalUpdate() 
      }
    
      }
      /**ena zidha hedhi */
      lignesBackup:LignePanierDto[]=[]
getAllLignePanier(){
  this.subscription2=this.backend.getAllPanierLignes(this.username).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.lignes=data.body
      this.lignesBackup=this.lignes
      console.log(this.lignes)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
    this.subtotalUpdate()
  })
}
/*
deleteLignePanier(id:number){
  console.log("product removed ")
  console.log(id)
  console.log(this.lignes)
  this.lignes= this.lignes.filter((value)=>value.id!=id)
  this.subtotalUpdate()
}*/
deleteLignePanier(id:number){
  this.subscription3=this.backend.deleteLignePanierById(id).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
      console.log(data.body)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
 this.getAllLignePanier()
 this.panierCommunicator.emitEvent()
})
}

updateQuantity(ligne:LignePanierDto,qte:number){
  ligne.ligneQuantite=qte
  /** ki tsave ligne panier save tarif avec ttc mch tarif barka  w zid chof hkeyat tarif fl kol*/
  ligne.ligneTotalTtc=ligne.tarifttc*ligne.ligneQuantite
  this.subtotalUpdate()
}
      subTotal=0
  quantity=0
  username:any
  ngOnInit(): void {
    this.username=this.storageService.getUser()?.username
    this.subtotalUpdate()
    
  }
  close(){
    this.ref.close()
  }      
navigate(){
this.ref.close()
this.router.navigate(["/store/panier"])
}

subtotalUpdate(){
  this.subTotal=0
  for(let ligne of this.lignes){
    this.subTotal=this.subTotal+ligne.ligneTotalTtc
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
