import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../services/storage.service';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { Client } from '../models/client';
import { BackendService } from '../services/backend.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {
constructor(private refDialog:MatDialogRef<UpdateClientComponent>,private formBuilder:FormBuilder,private storage:StorageService
  ,private renderer:Renderer2,@Inject(MAT_DIALOG_DATA) public data: Client,private backend:BackendService,private toaster:ToastrService ){

}
response:any
username:any
myForm!:FormGroup
updated=false
subscription1!:Subscription 
  ngOnInit(): void {
    console.log(this.data)
this.username=this.storage.getUser()?.username
    this.myForm=this.formBuilder.group({
      /*emailClient:['',[EmailFormatValidator]],codeClient:['',[Validators.required]],intituleClient:['',[Validators.required],],
      matricule_fiscale:['',[Validators.required]],
      adresseClient:['',[Validators.required]],ville:[''],
      codePostale:['',[Validators.pattern("[0-9]+")]],
      telephoneClient:['',[Validators.required,Validators.pattern("[0-9]{8}")]]*/
      email:[this.data.email,[EmailFormatValidator]],
      //code:[this.data.code,[Validators.required]],
      intitule:[this.data.intitule,[Validators.required]],matricule_Fiscale:[this.data.matricule_Fiscale,[Validators.required]],
      adresse:[this.data.adresse,[Validators.required]],ville:[this.data.ville,[]],
      codePostale:[this.data.codePostale,[Validators.pattern("[0-9]+")]],
      telephone:[this.data.telephone,[Validators.required,Validators.pattern("[0-9]{8}")]]
    })
  }

  displayEmailFormat=false
   emailValidator() {
       console.log("email validator executing")
     
       if (this.myForm?.controls["email"].valid) {
         this.removeClassFromInput("email")
       } else {
         this.addErrorClassToInput("email")
       }
     
       if (this.myForm?.controls["email"].hasError("EmailFormat")) {
         this.displayEmailFormat = true
       }
     
       if (!this.myForm?.controls["email"].hasError("EmailFormat")) {
         this.displayEmailFormat = false
       }
     }
     /*
   displayCodeRequired=false
   codeValidator() {
     if (this.myForm?.controls["code"].valid) {
       this.removeClassFromInput("code");
     } else {
       this.addErrorClassToInput("code");
     }
     if (this.myForm?.controls["code"].hasError("required")) {
       this.displayCodeRequired = true
     }
   
     if (!this.myForm?.controls["code"].hasError("required")) {
       this.displayCodeRequired = false
     }
   }
   */
   displayIntituleRequired=false
   intituleValidator() {
     if (this.myForm?.controls["intitule"].valid) {
       this.removeClassFromInput("intitule")
     } else {
       this.addErrorClassToInput("intitule")
     }
     if (this.myForm?.controls["intitule"].hasError("required")) {
       this.displayIntituleRequired = true
     }
   
     if (!this.myForm?.controls["intitule"].hasError("required")) {
       this.displayIntituleRequired = false
     }
   }
 
   displayMatricule_FiscaleRequired=false
   matricule_FiscaleValidator() {
     if (this.myForm?.controls["matricule_Fiscale"].valid) {
       this.removeClassFromInput("matricule_Fiscale")
     } else {
       this.addErrorClassToInput("matricule_Fiscale")
     }
     if (this.myForm?.controls["matricule_Fiscale"].hasError("required")) {
       this.displayMatricule_FiscaleRequired = true
     }
   
     if (!this.myForm?.controls["matricule_fiscale"].hasError("required")) {
       this.displayMatricule_FiscaleRequired = false
     }
   }
   displayAdresseRequired=false
   adresseClientValidator() {
     if (this.myForm?.controls["adresse"].valid) {
       this.removeClassFromInput("adresse")
     } else {
       this.addErrorClassToInput("adresse")
     }
     if (this.myForm?.controls["adresse"].hasError("required")) {
       this.displayAdresseRequired = true
     }
   
     if (!this.myForm?.controls["adresse"].hasError("required")) {
       this.displayAdresseRequired= false
     }
   }
 
  
   displayCodePostaleFormat=false
   codePostaleValidator() {
     if (this.myForm?.controls["codePostale"].valid) {
       this.removeClassFromInput("codePostale")
       
     } else {
       this.addErrorClassToInput("codePostale")
     }
           
       if(this.myForm?.controls["codePostale"].hasError("pattern")){
         this.displayCodePostaleFormat=true
       }
       if(!this.myForm?.controls["codePostale"].hasError("pattern")){
         this.displayCodePostaleFormat=false
       }
   }
   displayTelephoneRequired=false
   displayTelephoneFormat=false
   telephoneValidator() {
     if (this.myForm?.controls["telephone"].valid) {
       this.removeClassFromInput("telephone")
     }else {
       this.addErrorClassToInput("telephone")
     }
     if(this.myForm?.controls["telephone"].hasError("required")){
       this.displayTelephoneRequired=true
     }else{
       this.displayTelephoneRequired==false
       }     
       if(!this.myForm?.controls["telephone"].hasError("required") && this.myForm?.controls["telephone"].hasError("pattern")){
          this.displayTelephoneFormat=true
        }
        if(!this.myForm?.controls["telephone"].hasError("pattern")){
          this.  displayTelephoneFormat=false
        }
    }
    addErrorClassToInput(id:string){
      let elem=document.getElementById(id)
      this.renderer.addClass(elem,"inputError")
    }
    removeClassFromInput(id:string){
      let elem=document.getElementById(id)
      this.renderer.removeClass(elem,"inputError")
    }
  close(){
    this.refDialog.close()
  }
  triggerBlur(){
    const inputFields = document.querySelectorAll('input');
inputFields.forEach(field => {
  field.dispatchEvent(new Event('blur'));
});
  }
  update(){
this.subscription1=this.backend.updateClient(this.myForm.value,this.data.id).subscribe((data)=>{
  console.log(data.status)
  if(data.body!=null){
    this.response=data
    console.log(this.response)
    this.updated=true
    this.toaster.success("","Update was successful")
  }
},(error)=>{
console.log(error.error)
},()=>{
  this.refDialog.close(this.updated)}
)
  }
  reset(){

    this.myForm.setValue({
      email:this.data.email,code:this.data.code,
      intitule:this.data.intitule,matricule_Fiscale:this.data.matricule_Fiscale,
      adresse:this.data.adresse,ville:this.data.adresse,
      codePostale:this.data.codePostale,telephone:this.data.telephone
    })

  this.displayEmailFormat=false
  //this.displayCodeRequired=false
  this.displayIntituleRequired=false
  this.displayMatricule_FiscaleRequired = false
  this.displayAdresseRequired= false
  this.displayCodePostaleFormat=false
  this.displayTelephoneRequired=false
  this.displayTelephoneFormat=false

  this.removeClassFromInput("email")
  //this.removeClassFromInput("code")
  this.removeClassFromInput("intitule")
  this.removeClassFromInput("matricule_Fiscale")
  this.removeClassFromInput("adresse")
  this.removeClassFromInput("codePostale")
  this.removeClassFromInput("telephone")

}
}
