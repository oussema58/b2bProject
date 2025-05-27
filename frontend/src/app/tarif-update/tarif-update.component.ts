import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../models/article';
import { AfterTodayValidator } from '../validators/AfterToday.validator';
import { TarifEnt } from '../models/tarifEnt';
import { ActivatedRoute, Router } from '@angular/router';
import { TarifLigne } from '../models/tarifLigne';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tarif-update',
  templateUrl: './tarif-update.component.html',
  styleUrls: ['./tarif-update.component.css']
})
export class TarifUpdateComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private formBuilder:FormBuilder,
    private renderer:Renderer2,private activated:ActivatedRoute,private router:Router){

  }
  subscription1!:Subscription
  subscription2!:Subscription
  tarifOriginal!:TarifEnt
  tarif!:TarifEnt
  tarifLignes:TarifLigne[]=[]
  intituleTarif=""
  getTarif(){
    this.activated.paramMap.subscribe((params)=>{
      this.idTarif=Number(params.get("idTarif"))
      console.log("tarif id is")
      console.log(this.idTarif)
    })
    this.subscription1=this.backend.getTarifById(this.idTarif).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.tarifOriginal=data.body
      console.log("originaal tarif ")
      console.log(this.tarifOriginal)
      this.tarifLignes=[]
      for(let tarif of this.tarifOriginal.tarifs){
        if(tarif.article.articleEtat){
          this.tarifLignes.push(tarif)
        }
      }
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    if(error.status==404){
      this.router.navigate(["/notFound"])
    }
    },()=>{
     console.log("date in myform")
     console.log(this.tarifOriginal.tarif_Entete_DateFin.toString().split('T')[0])
     this.myForm=this.formBuilder.group({
      tarif_Entete_intitule:[this.tarifOriginal.tarif_Entete_intitule,[Validators.required]],
      tarif_Entete_DateFin:[this.tarifOriginal.tarif_Entete_DateFin.toString().split('T')[0],[Validators.required,AfterTodayValidator]]
    })
      console.log("no problem")})
      console.log(this.myForm)
  }

  canSubmit=true
  articles:Article[]=[]
  myForm!:FormGroup
  //tarifLignes:TarifLigneDto[]=[]
  idTarif:number=0
  ngOnInit(): void {
    
this.getTarif()
this.myForm=this.formBuilder.group({
  tarif_Entete_intitule:["",[Validators.required]],
  tarif_Entete_DateFin:["",[Validators.required,AfterTodayValidator]]
  //tarif_Entete_DateFin:[this.tarifOriginal.tarif_Entete_DateFin.toISOString().split('T')[0],[Validators.required,AfterTodayValidator]]
})
/*this.myForm.statusChanges.subscribe(status => {
  if (status === 'VALID') {
this.canSubmit=true
  } else if (status === 'INVALID') {
    this.canSubmit=false
  }
});*/
//this.getArticles()
  }
  prixValidator(ligne:TarifLigne){
    if(ligne.tarifPrix==null){
      ligne.tarifPrix=0
    }else{
    if(ligne.tarifPrix<0){
      ligne.tarifPrix=0
      this.toaster.error("l'article avec code "+ligne.article.articleCode+" ne doit pas avoir une valeur negative")
    }
  }
  }
update(){
  if(this.myForm.valid){

    for(let tarif of this.tarifLignes){
      if(tarif.tarifPrix==0 && tarif.enVente){
        this.toaster.error("l'article avec code "+tarif.article.articleCode+" ne doit pas etre exposées au vente car son prix est 0")
        return
      }
    }

    this.tarifOriginal.tarif_Entete_intitule=this.myForm.controls["tarif_Entete_intitule"].value
    this.tarifOriginal.tarif_Entete_DateFin=this.myForm.controls["tarif_Entete_DateFin"].value
    console.log("body to send")
this.tarifOriginal.tarifs=this.tarifLignes
    console.log(this.tarifOriginal)
  this.subscription2=this.backend.updateTarif(this.tarifOriginal,this.tarifOriginal.tarifEnteteId).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.data=data.body
    console.log(this.data)
    this.toaster.success(this.data.message,"Terminé avec succées")
  }},(error)=>{
    console.log(error)
    console.log(error.status)
  console.log(error.error)
  this.toaster.error(error.error,"Terminé avec echec")
 
  },()=>{
   this.reset()
    console.log("no problem")})
}else{
  this.toaster.warning("check fields")
  this.validateAllFields()
}
}
  /*populateTarif(){
for(let article of this.articles){
  this.tarifLignes.push(new TarifLigneDto(0,article.articleID,article))
}
console.log(this.tarifLignes)
  }
  */
 /*
  getArticles(){
    
    this.backend.getArticles().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.articles=data.body
      console.log(this.articles)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      this.populateTarif()
      console.log("no problem")})
  }
  */
  addErrorClassToInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.addClass(elem,"inputError")
  }
  removeClassFromInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.removeClass(elem,"inputError")
  }
displayTarif_Entete_DateFinRequired=false
displayTarif_Entete_DateFinWrong=false
tarif_Entete_DateFinValidator(){
  if(this.myForm.controls["tarif_Entete_DateFin"].value==""){
    this.myForm.controls["tarif_Entete_DateFin"].setErrors({required:true})
  }else{
    this.myForm.controls["tarif_Entete_DateFin"].setErrors({required:null})
    this.myForm.controls["tarif_Entete_DateFin"].updateValueAndValidity();
  }
  if(this.myForm.controls["tarif_Entete_DateFin"].valid){
    this.removeClassFromInput("tarif_Entete_DateFin")
  }else{
    this.addErrorClassToInput("tarif_Entete_DateFin")
  }
  if(this.myForm.controls["tarif_Entete_DateFin"].hasError("required")){
    this.displayTarif_Entete_DateFinRequired=true
  }else{
    this.displayTarif_Entete_DateFinRequired=false
  }
  if(this.myForm.controls["tarif_Entete_DateFin"].hasError("afterToday")){
    this.displayTarif_Entete_DateFinWrong=true
  }else{
    this.displayTarif_Entete_DateFinWrong=false
  }
  console.log("date chosen"+this.myForm.controls["tarif_Entete_DateFin"].value)
  console.log(this.myForm.controls["tarif_Entete_DateFin"])

}
displayTarif_Entete_intituleRequired=false
tarif_Entete_intituleValidator(){
  if(this.myForm.controls["tarif_Entete_intitule"].valid){
    this.removeClassFromInput("tarif_Entete_intitule")
  }else{
    this.addErrorClassToInput("tarif_Entete_intitule")
  }
  if(this.myForm.controls["tarif_Entete_intitule"].hasError("required")){
    this.displayTarif_Entete_intituleRequired=true
  }else{
    this.displayTarif_Entete_intituleRequired=false
  }
}

ngOnDestroy(): void {
  if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  if(this.subscription2){
    this.subscription2.unsubscribe()
  }

  //this.reset()
}
data:any
/*update(){
  if(this.myForm.valid){
   
    console.log("tarif entete ")
    console.log(tarifEntDto)
    this.backend.addTarif(tarifEntDto).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.data=data.body
      console.log(this.data)
      this.toaster.success(this.data.message,"creation successful")
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    this.toaster.error(error.error)
    },()=>{
     this.reset()
      console.log("no problem")})
  }

}*/

reset(){
  this.getTarif()
  this.displayTarif_Entete_DateFinRequired=false
  this.displayTarif_Entete_intituleRequired=false
  this.removeClassFromInput("tarif_Entete_intitule")
  this.removeClassFromInput("tarif_Entete_DateFin")
  this.myForm.patchValue({
    tarif_Entete_intitule:this.tarifOriginal.tarif_Entete_intitule,
  tarif_Entete_DateFin:this.tarifOriginal.tarif_Entete_DateFin
  })
//this.tarifLignes=[]
//this.populateTarif()

}
validateAllFields(){
  this.tarif_Entete_DateFinValidator()
  this.tarif_Entete_DateFinValidator()
}

}
