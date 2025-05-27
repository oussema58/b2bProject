import { Component, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { Subscription } from 'rxjs';
import { AfterTodayValidator } from '../validators/AfterToday.validator';
import { updateCommandeDto } from '../models/updateCommandeDto';

@Component({
  selector: 'app-commande-livraison-date',
  templateUrl: './commande-livraison-date.component.html',
  styleUrls: ['./commande-livraison-date.component.css']
})
export class CommandeLivraisonDateComponent {
  constructor(private refDialog:MatDialogRef<CommandeLivraisonDateComponent>,private formBuilder:FormBuilder,private storage:StorageService
    ,private renderer:Renderer2,@Inject(MAT_DIALOG_DATA) public idCommande: number,private backend:BackendService,private toaster:ToastrService ){
  
  }
  myForm!:FormGroup
  datePrevue!:Date
  OnInit(){
    /*this.myForm=this.formBuilder.group({
      tarif_Entete_DateFin:['',[Validators.required,AfterTodayValidator]]
    })*/
  }

  readonly accepter="VALIDE"
  subscription1!:Subscription
  displayTarif_Entete_DateFinRequired=false
displayTarif_Entete_DateFinWrong=false
valid=true
tarif_Entete_DateFinValidator(){
  
  
  if(this.datePrevue==null){
    this.displayTarif_Entete_DateFinRequired=true
    this.valid=false
  }else{
    this.displayTarif_Entete_DateFinRequired=false
  }
  this.checkFutureDate()
  if(this.valid){
    this.removeClassFromInput("tarif_Entete_DateFin")
  }else{
    this.addErrorClassToInput("tarif_Entete_DateFin")
  }
}

checkFutureDate(){
  if(this.datePrevue==null){
    this.displayTarif_Entete_DateFinWrong=false
    this.valid=false
    return
  }
  console.log("after today validator is executing")
  let chosen=new Date(this.datePrevue)
let current=new Date()
console.log(chosen)

console.log(chosen.getUTCFullYear())

console.log(chosen.getUTCMonth())
console.log(current.getUTCMonth())
console.log(chosen.getUTCDate())
console.log(current.getUTCDate())
if(current.getUTCFullYear()>chosen.getUTCFullYear()){
    this.displayTarif_Entete_DateFinWrong=true
    this.valid=false
    return
}
if(current.getUTCFullYear()<chosen.getUTCFullYear()){
  this.displayTarif_Entete_DateFinWrong=false
  this.valid=true
  return
}
if(current.getUTCMonth()>chosen.getUTCMonth()){
    this.displayTarif_Entete_DateFinWrong=true
    this.valid=false
  return 
}
if(current.getUTCMonth()<chosen.getUTCMonth()){
  this.displayTarif_Entete_DateFinWrong=false
  this.valid=true
    return 
}
if(current.getUTCDate()>=chosen.getUTCDate()){
  this.displayTarif_Entete_DateFinWrong=true
  this.valid=false
}else{
this.displayTarif_Entete_DateFinWrong=false
this.valid=true
}
}
/*tarif_Entete_DateFinValidator(){
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

}*/
addErrorClassToInput(id:string){
  let elem=document.getElementById(id)
  this.renderer.addClass(elem,"inputError")
}
removeClassFromInput(id:string){
  let elem=document.getElementById(id)
  this.renderer.removeClass(elem,"inputError")
}

  updateStaus(){
    let body:updateCommandeDto=new updateCommandeDto(this.accepter)
    body.datePrevue=this.datePrevue
    this.subscription1=this.backend.updateCommandStatus(this.idCommande,body).subscribe((data)=>{
       console.log(data.status)
       if(data.body!=null){
       //this.commandes=data.body.reverse()
       this.toaster.success("commande "+this.accepter,"Traitement fait avec succées",{disableTimeOut:true})
       
     }},(error)=>{
       console.log(error.status)
     console.log(error.error)
     },()=>{
       console.log("no problem")})
       this.refDialog.close(true)
   }
   annuler(){
    this.refDialog.close()
   }
   
   }

