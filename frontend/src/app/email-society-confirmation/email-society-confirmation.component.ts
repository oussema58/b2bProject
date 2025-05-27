import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordFormatValidator } from '../validators/PasswordFormat.validator';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-society-confirmation',
  templateUrl: './email-society-confirmation.component.html',
  styleUrls: ['./email-society-confirmation.component.css']
})
export class EmailSocietyConfirmationComponent implements OnDestroy {
  constructor(private backend:BackendService,private active:ActivatedRoute,private toaster:ToastrService,
    private formBuilder:FormBuilder,private renderer:Renderer2){
  }
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
    if(this.subscription2){
      this.subscription2.unsubscribe()
    }
  }
  token=""
  userEmail=""
  society=""
  data:any
 myForm!:FormGroup
 subscription1!:Subscription
 subscription2!:Subscription
 addErrorClassToInput(id:string){
  let elem=document.getElementById(id)
  this.renderer.addClass(elem,"inputError")
}
removeClassFromInput(id:string){
  let elem=document.getElementById(id)
  this.renderer.removeClass(elem,"inputError")
}

 displayTelephoneUserRequired=false
 displayTelephoneUserFormat=false
 telephoneUserValidator() {
   if (this.myForm?.controls["telephoneUser"].valid) {
     this.removeClassFromInput("telephoneUser")
   } else {
     this.addErrorClassToInput("telephoneUser")
   }
   if(this.myForm?.controls["telephoneUser"].hasError("required")){
     this.displayTelephoneUserRequired=true
         }else{
           this.displayTelephoneUserRequired==false
         }
         
     if(!this.myForm?.controls["telephoneUser"].hasError("required") && this.myForm?.controls["telephoneUser"].hasError("pattern")){
       this.displayTelephoneUserFormat=true
     }
     if(!this.myForm?.controls["telephoneUser"].hasError("pattern")){
       this.displayTelephoneUserFormat=false
     }
 }

  displayCodePostaleUserFormat=false
  codePostaleUserValidator() {
    if (this.myForm?.controls["codePostaleUser"].valid) {
      this.removeClassFromInput("codePostaleUser")
      
    } else {
      this.addErrorClassToInput("codePostaleUser")
    }
    if(this.myForm?.controls["codePostaleUser"].hasError("pattern")){
      this.displayCodePostaleUserFormat=true
    }else{
      this.displayCodePostaleUserFormat=false
    }
    /*if(this.myForm?.controls["codePostaleUser"].hasError("required")){
      this.displayCodePostaleUserRequired=true
          }else{
            this.displayCodePostaleUserRequired=false
          }*/
          
      /*if(!this.myForm?.controls["codePostaleUser"].hasError("required") && this.myForm?.controls["codePostaleUser"].hasError("pattern")){
        this.displayCodePostaleUserFormat=true
      }
      if(!this.myForm?.controls["codePostaleUser"].hasError("pattern")){
        this.displayCodePostaleUserFormat=false
      }
      */
  }
  displayRegistreCommerceRequired = false
  registreCommerceValidator() {
    if (this.myForm?.controls["registreCommerce"].valid) {
      this.removeClassFromInput("registreCommerce")
      this.displayRegistreCommerceRequired = false
    } else {
      this.addErrorClassToInput("registreCommerce")
      this.displayRegistreCommerceRequired = true
    }
  }
  displayMatriculeFiscalRequired = false
  matriculeFiscalValidator() {
    if (this.myForm?.controls["matriculeFiscal"].valid) {
      this.removeClassFromInput("matriculeFiscal")
      this.displayMatriculeFiscalRequired = false
    } else {
      this.addErrorClassToInput("matriculeFiscal")
      this.displayMatriculeFiscalRequired = true
    }
  }
  displayMatriculeRequired = false
  matriculeValidator() {
    if (this.myForm?.controls["matricule"].valid) {
      this.removeClassFromInput("matricule")
      this.displayMatriculeRequired = false
    } else {
      this.addErrorClassToInput("matricule")
      this.displayMatriculeRequired = true
    }
  }
  /*displayAdresseRequired = false
  adresseValidator() {
    if (this.myForm?.controls["adresse"].valid) {
      this.removeClassFromInput("adresse")
      this.displayAdresseRequired = false
    } else {
      this.addErrorClassToInput("adresse")
      this.displayAdresseRequired = true
    }
  }
  */
    ngOnInit(): void {
      this.myForm=this.formBuilder?.group(
        {registreCommerce:['',[Validators.required]],matriculeFiscal:['',[Validators.required,],],
        matricule:['',[Validators.required]],adresse:[''],
        codePostaleUser:['',[Validators.pattern("[0-9]*")]],telephoneUser:['',[Validators.required,Validators.pattern("[0-9]{8}")]]})
        
  this.active.queryParams.subscribe((params)=>{
  this.token=params["token"]
  this.userEmail=params["userEmail"]
  this.society=params["society"]
  })
    }
    declineSociety(){
      this.subscription1=this.backend.DeclineSociety(this.userEmail,this.token,this.society).subscribe((data)=>{
        this.data=data
        console.log(data)
        this.toaster.success("your Account is Deleted successfully","Account Deletion Accepted")
            },(error)=>{
              this.toaster.error(error.error,"Account Deletion Denied")
            console.log(error.status)
            console.log(error.error)
            })
    }
    confirmSociety(){
      if(this.myForm.valid){
        this.subscription2=this.backend.confirmSociety(this.userEmail,this.userEmail,this.society,this.myForm.value).subscribe((data)=>{
          this.data=data
          console.log(data)
          this.toaster.success("your Account is enabled","Confirmation Accepted")
              },(error)=>{
                this.toaster.error(error.error,"Confirmation Denied")
              console.log(error.status)
              console.log(error.error)
              })
      }
    }
    reset(){
      this.displayTelephoneUserRequired=false
      this.displayTelephoneUserFormat=false
      this.displayCodePostaleUserFormat=false
      this.displayRegistreCommerceRequired = false
      this.displayMatriculeFiscalRequired = false
      this.displayMatriculeRequired=false
      this.removeClassFromInput("telephoneUser")
      this.removeClassFromInput("codePostaleUser")
      this.removeClassFromInput("registreCommerce")
      this.removeClassFromInput("matriculeFiscal")
      this.removeClassFromInput("matricule")

    }
}

