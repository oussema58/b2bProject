import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article } from '../models/article';
import { AfterTodayValidator } from '../validators/AfterToday.validator';
import { TarifEntDto } from '../models/TarifEntDto';
import { TarifLigneDto } from '../models/tarifLigneDto';
import { TarifLigne } from '../models/tarifLigne';
import { TarifEnt } from '../models/tarifEnt';
import { router } from 'ngx-bootstrap-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tarif-add',
  templateUrl: './tarif-add.component.html',
  styleUrls: ['./tarif-add.component.css']
})
export class TarifAddComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private formBuilder:FormBuilder,
    private renderer:Renderer2,private router:Router){

  }
  subscription1!:Subscription
  subscription2!:Subscription
  intituleTarif=""
  canSubmit=false
  articles:Article[]=[]
  myForm!:FormGroup
  //tarifLignes:TarifLigneDto[]=[]
  tarifLignes:TarifLigne[]=[]
  ngOnInit(): void {
this.myForm=this.formBuilder.group({
  tarif_Entete_intitule:['',[Validators.required,Validators.pattern("^[A-Za-z]+( [A-Za-z]+)*( [0-9]+)*$")]],
  tarif_Entete_Code:['',[Validators.required,Validators.pattern("^[A-Za-z][A-Za-z0-9]*$")]],
  tarif_Entete_DateFin:['',[Validators.required,AfterTodayValidator]]
})
/*this.myForm.statusChanges.subscribe(status => {
  if (status === 'VALID') {
this.canSubmit=true
  } else if (status === 'INVALID') {
    this.canSubmit=false
  }
});*/
this.getActiveArticles()
  }

  populateTarif(){
for(let article of this.articles){
 // this.tarifLignes.push(new TarifLigneDto(0,article.articleID,article))
 this.tarifLignes.push(new TarifLigne(0,article.articleIntitule,article,0))
}
console.log(this.tarifLignes)
  }
  getActiveArticles(){
    
   this.subscription1=this.backend.getActiveArticles().subscribe((data)=>{
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
  addErrorClassToInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.addClass(elem,"inputError")
  }
  removeClassFromInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.removeClass(elem,"inputError")
  }
displayTarif_Entete_CodeRequired=false
displayTarif_Entete_CodeFormat=false
tarif_Entete_CodeValidator(){
  if(this.myForm.controls["tarif_Entete_Code"].valid){
    this.removeClassFromInput("tarif_Entete_Code")
  }else{
    this.addErrorClassToInput("tarif_Entete_Code")
  }
  if(this.myForm.controls["tarif_Entete_Code"].hasError("required")){
    this.displayTarif_Entete_CodeRequired=true
  }else{
    this.displayTarif_Entete_CodeRequired=false
  }
  if(this.myForm.controls["tarif_Entete_Code"].hasError("pattern")){
    this.displayTarif_Entete_CodeFormat=true
  }else{
    this.displayTarif_Entete_CodeFormat=false
  }
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
displayTarif_Entete_intituleFormat=false
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
  if(this.myForm.controls["tarif_Entete_intitule"].hasError("pattern")){
    this.displayTarif_Entete_intituleFormat=true
  }else{
    this.displayTarif_Entete_intituleFormat=false
  }
}


data:any
add(){
  if(this.myForm.valid){
    /*let tarifEntDto=new TarifEntDto(this.myForm.controls["tarif_Entete_intitule"].value,
    this.myForm.controls["tarif_Entete_Code"].value,this.myForm.controls["tarif_Entete_DateFin"].value,
    /*(new Date(this.myForm.controls["tarif_Entete_DateFin"].value)).toLocaleDateString("en-US"),
    this.tarifLignes)*/
    if(this.tarifLignes.length!=0){
      /*check that the articles that will be displayed to the client should not have 0 as a a value */
      for(let tarif of this.tarifLignes){
        if(tarif.tarifPrix==0 && tarif.enVente){
          this.toaster.error("l'article avec code "+tarif.article.articleCode+" ne doit pas etre exposées au vente car son prix est 0")
          return
        }
      }




    let tarifEnt=new TarifEnt(this.myForm.controls["tarif_Entete_intitule"].value,
    this.myForm.controls["tarif_Entete_Code"].value,this.myForm.controls["tarif_Entete_DateFin"].value,
    /*(new Date(this.myForm.controls["tarif_Entete_DateFin"].value)).toLocaleDateString("en-US"),*/
    this.tarifLignes,0)
    console.log("tarif entete ")
    console.log(tarifEnt)
    //this.backend.addTarif(tarifEntDto).subscribe((data)=>{
      this.subscription2=this.backend.addTarifV2(tarifEnt).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.data=data.body
      console.log(this.data)
      this.toaster.success("Terminé avec succées",this.data.message,{disableTimeOut:true})
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    this.toaster.error("Terminé avec echec",error.error)
    },()=>{
     this.reset()
      console.log("no problem")
      this.router.navigate(['dashboard/tarif'])}
    )
  }else{
    this.toaster.error("essayer d'ajouter ou mettre en vente des articles avant de creer le tarif","Operation terminée avec echec")
  }
  }else{
    this.toaster.warning("verifier vos champs")
    this.validateAllFields()
  }

}

prixValidator(ligne:TarifLigne){
  console.log(ligne.tarifPrix)
  if(ligne.tarifPrix==null){
    ligne.tarifPrix=0
  }else{
  if(ligne.tarifPrix<0){
    ligne.tarifPrix=0
    this.toaster.error("l'article avec code "+ligne.article.articleCode+" ne doit pas avoir une valeur negative")
  }
}
}

reset(){
  this.displayTarif_Entete_CodeRequired=false
  this.displayTarif_Entete_DateFinRequired=false
  this.displayTarif_Entete_intituleRequired=false
  this.removeClassFromInput("tarif_Entete_Code")
  this.removeClassFromInput("tarif_Entete_intitule")
  this.removeClassFromInput("tarif_Entete_DateFin")
  this.myForm.patchValue({
    tarif_Entete_intitule:'',
  tarif_Entete_Code:'',
  tarif_Entete_DateFin:''
  })
this.tarifLignes=[]
this.populateTarif()
}
ngOnDestroy(): void {
  if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  if(this.subscription2){
    this.subscription2.unsubscribe()
  }

  this.reset()
}
validateAllFields(){
  this.tarif_Entete_CodeValidator()
  this.tarif_Entete_DateFinValidator()
  this.tarif_Entete_intituleValidator()
}
}
