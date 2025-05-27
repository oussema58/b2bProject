import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { BackendService } from '../services/backend.service';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { PasswordFormatValidator } from '../validators/PasswordFormat.validator';
import { ToastrService } from 'ngx-toastr';
import { TarifEnt } from '../models/tarifEnt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  myForm!:FormGroup
  constructor(private http:HttpClient,private renderer:Renderer2,private router:Router,
    private storage:StorageService,private dialogRef:MatDialogRef<SignupComponent>,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService){
  }
  subscription1!:Subscription
  subscription2!:Subscription
dialogResult=false
tarifsEnt:TarifEnt[]=[]
  ngOnInit(): void {
    this.myForm=this.formBuilder?.group(
      //userInfo
      {password:['',[Validators.required,PasswordFormatValidator]],
      /*emailUser:[''],telephoneUser:[''],*/
      /*username:['',[Validators.required]],name:['',[Validators.required,Validators.pattern("[A-Za-z][a-z]* [a-z]*")]],*/
      username:['',[Validators.required,Validators.pattern("^[A-Za-z]+[A-Za-z0-9]$")]],name:['',[Validators.required,Validators.pattern("[A-Za-z][a-z]*( [A-Za-z][a-z]*)+")]],  
      //societe info
      emailClient:['',[EmailFormatValidator]],codeClient:['',[Validators.required,Validators.pattern("^[A-Za-z][A-Za-z0-9]*$")]],intituleClient:['',[Validators.required]],
      matricule_fiscale:['',[Validators.required,Validators.pattern("[A-Za-z0-9]{13}")]],
      adresseClient:['',[Validators.required]],ville:[''],
      codePostale:['',[Validators.pattern("[0-9]{4}")]],
      telephoneClient:['',[Validators.required,Validators.pattern("[0-9]{8}")]],
      entTarifId:[0],
      entTarif:['',[Validators.required]]
    }  
      )
    this.getAllTarifs()
  } 

  image!:File
  selectFile(event: any) {
    this.image = event.target.files.item(0);
  }

  getAllTarifs(){
    this.subscription1=this.backend.getAllTarif().subscribe((data)=>{console.log(data);
      console.log("status")
      console.log(data.status)
      if(data.body!=null){
        this.tarifsEnt=data.body
        console.log(this.tarifsEnt)
          }
        },
          (error)=>{console.log("a problem when fetching the user from database ")

                    console.log(error)
                    console.log(error.status)
                    console.log(error.error)
      
        }

          )
  }
  displayEntTarifRequired=false
      tarifEntValidator(){
        if(this.myForm?.controls["entTarif"].value==""){
          this.myForm?.controls["entTarif"].setErrors({required:true})
        }else{
          this.myForm?.controls["entTarif"].setErrors(null)
        }
      if(this.myForm?.controls["entTarif"].valid){
        this.removeClassFromInput("entTarif")
      }else{
        this.addErrorClassToInput("entTarif")
      }
      if(this.myForm?.controls["entTarif"].hasError("required")){
       this.displayEntTarifRequired=true
     }else{
       this.displayEntTarifRequired=false
     }
      }
  displayPasswordFormat=false
  displayPasswordRequired=false
  passwordValidator(){
    console.log("password validator executing")
    if(this.myForm?.controls["password"].valid){
      this.removeClassFromInput("password")
    }else{
      this.addErrorClassToInput("password")
    }
      if(this.myForm?.controls["password"].hasError("required")){
  this.displayPasswordRequired=true
      }else{
        this.displayPasswordRequired=false
      }
      
  if(!this.myForm?.controls["password"].hasError("required") && this.myForm?.controls["password"].hasError("PasswordFormat")){
    this.displayPasswordFormat=true
  }
  if(!this.myForm?.controls["password"].hasError("PasswordFormat")){
    this.displayPasswordFormat=false
  }
  }
  /*
  displayEmailFormat=false
  emailUserValidator(){
    
    console.log("email validator executing")
  if(this.myForm?.controls["emailUser"].valid){
    this.removeClassFromInput("emailUser")
  }else{
    this.addErrorClassToInput("emailUser")
  } 
if(this.myForm?.controls["emailUser"].hasError("EmailFormat")){
  this.displayEmailFormat=true
}
if(!this.myForm?.controls["emailUser"].hasError("EmailFormat")){
  this.displayEmailFormat=false
}
  }
  /*
  displayCodeUserRequired=false
  codeUserValidator(){
   if(this.myForm?.controls["codeUser"].valid){
     this.removeClassFromInput("codeUser")
     this.displayCodeUserRequired=false
   }else{
     this.addErrorClassToInput("codeUser")
     this.displayCodeUserRequired=true
   }
   }
   */
  /*
  displayIntituleRequired=false
  intituleUserValidator(){
    if(this.myForm?.controls["intituleUser"].valid){
      this.removeClassFromInput("intituleUser")
      this.displayIntituleRequired=false
    }else{
      this.addErrorClassToInput("intituleUser")
      this.displayIntituleRequired=true
     }
  }
  displayMatriculeUserRequired=false
  matriculeUserValidator(){
    if(this.myForm?.controls["matriculeUser"].valid){
      this.removeClassFromInput("matriculeUser")
      this.displayMatriculeUserRequired=false
    }else{
      this.addErrorClassToInput("matriculeUser")
      this.displayMatriculeUserRequired=true
    }
  }
  */
 /*
  displayTelephoneUserRequired=false
  displayTelephoneUserFormat=false
  telephoneUserValidator() {
    if (this.myForm?.controls["telephoneUser"].valid) {
      this.removeClassFromInput("telephoneUser")
    }else {
      this.addErrorClassToInput("telephoneUser")
    }    
      if(this.myForm?.controls["telephoneUser"].hasError("pattern")){
         this.displayTelephoneUserFormat=true
       }
       if(!this.myForm?.controls["telephoneUser"].hasError("pattern")){
         this.  displayTelephoneUserFormat=false
       }
   }
   */
   displayUsernameRequired=false
   displayUsernameFormat=false
   usernameValidator(){
     if(this.myForm?.controls["username"].valid){
       this.removeClassFromInput("username")
     }else{
       this.addErrorClassToInput("username")
     }
     if(this.myForm?.controls["username"].hasError("required")){
      this.displayUsernameRequired=true
     }else{
      this.displayUsernameRequired=false
     }

     if(this.myForm?.controls["username"].hasError("pattern")){
      this.displayUsernameFormat=true
     }else{
      this.displayUsernameFormat=false
     }

   } 
   displayNameRequired=false
   displayNameFormat=false
   nameValidator() {
     if (this.myForm?.controls["name"].valid) {
       this.removeClassFromInput("name")
     } else {
       this.addErrorClassToInput("name")
     }
     if(this.myForm?.controls["name"].hasError("required")){
       this.displayNameRequired=true
           }else{
             this.displayNameRequired=false
           }
           
       if(!this.myForm?.controls["name"].hasError("required") && this.myForm?.controls["name"].hasError("pattern")){
         this.displayNameFormat=true
       }
       if(!this.myForm?.controls["name"].hasError("pattern")){
         this.displayNameFormat=false
       }
   } 
   displayEmailClientFormat=false
   emailClientValidator() {
       console.log("email validator executing")
     
       if (this.myForm?.controls["emailClient"].valid) {
         this.removeClassFromInput("emailClient")
       } else {
         this.addErrorClassToInput("emailClient")
       }
     
       if (this.myForm?.controls["emailClient"].hasError("EmailFormat")) {
         this.displayEmailClientFormat = true
       }
     
       if (!this.myForm?.controls["emailClient"].hasError("EmailFormat")) {
         this.displayEmailClientFormat = false
       }
     }
   displayCodeClientRequired=false
   displayCodeClientFormat=false
   
   codeClientValidator() {
     if (this.myForm?.controls["codeClient"].valid) {
       this.removeClassFromInput("codeClient");
     } else {
       this.addErrorClassToInput("codeClient");
     }
     if (this.myForm?.controls["codeClient"].hasError("required")) {
       this.displayCodeClientRequired = true
     }
   
     if (!this.myForm?.controls["codeClient"].hasError("required")) {
       this.displayCodeClientRequired = false
     }
     if (this.myForm?.controls["codeClient"].hasError("pattern")) {
      this.displayCodeClientFormat = true
    }else{
      this.displayCodeClientFormat = false
    }
   }
   
   displayIntituleClientRequired=false
   intituleClientValidator() {
     if (this.myForm?.controls["intituleClient"].valid) {
       this.removeClassFromInput("intituleClient")
     } else {
       this.addErrorClassToInput("intituleClient")
     }
     if (this.myForm?.controls["intituleClient"].hasError("required")) {
       this.displayIntituleClientRequired = true
     }
   
     if (!this.myForm?.controls["intituleClient"].hasError("required")) {
       this.displayIntituleClientRequired = false
     }
   }
 
   displayMatricule_fiscaleRequired=false
   displayMatricule_fiscaleFormat=false
   matricule_fiscaleValidator() {
     if (this.myForm?.controls["matricule_fiscale"].valid) {
       this.removeClassFromInput("matricule_fiscale")
     } else {
       this.addErrorClassToInput("matricule_fiscale")
     }
     if (this.myForm?.controls["matricule_fiscale"].hasError("required")) {
       this.displayMatricule_fiscaleRequired = true
     }
    if (!this.myForm?.controls["matricule_fiscale"].hasError("required")) {
       this.displayMatricule_fiscaleRequired = false
     }
     if (this.myForm?.controls["matricule_fiscale"].hasError("pattern")) {
      this.displayMatricule_fiscaleFormat = true
    }else{
      this.displayMatricule_fiscaleFormat = false
    }
   }
   displayAdresseClientRequired=false
   adresseClientValidator() {
     if (this.myForm?.controls["adresseClient"].valid) {
       this.removeClassFromInput("adresseClient")
     } else {
       this.addErrorClassToInput("adresseClient")
     }
     if (this.myForm?.controls["adresseClient"].hasError("required")) {
       this.displayAdresseClientRequired = true
     }
   
     if (!this.myForm?.controls["adresseClient"].hasError("required")) {
       this.displayAdresseClientRequired= false
     }
   }
 
  
   displayCodePostaleFormat=false
   codePostaleValidator() {
     if (this.myForm?.controls["codePostale"].valid) {
       this.removeClassFromInput("codePostale")
       
     } else {
       this.addErrorClassToInput("codePostale")
     }
           
       if(!this.myForm?.controls["codePostale"].hasError("required") && this.myForm?.controls["codePostale"].hasError("pattern")){
         this.displayCodePostaleFormat=true
       }
       if(!this.myForm?.controls["codePostale"].hasError("pattern")){
         this.displayCodePostaleFormat=false
       }
   }
   displayTelephoneClientRequired=false
   displayTelephoneClientFormat=false
   telephoneClientValidator() {
     if (this.myForm?.controls["telephoneClient"].valid) {
       this.removeClassFromInput("telephoneClient")
     }else {
       this.addErrorClassToInput("telephoneClient")
     }
     if(this.myForm?.controls["telephoneClient"].hasError("required")){
       this.displayTelephoneClientRequired=true
     }else{
       this.displayTelephoneClientRequired=false
       }     
       if(!this.myForm?.controls["telephoneClient"].hasError("required") && this.myForm?.controls["telephoneClient"].hasError("pattern")){
          this.displayTelephoneClientFormat=true
        }
        if(!this.myForm?.controls["telephoneClient"].hasError("pattern")){
          this.displayTelephoneClientFormat=false
        }
    }
  close(){
    this.dialogRef.close()
  }
  ngOnDestroy(): void {
  this.reset()
  if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  if(this.subscription2){
    this.subscription2.unsubscribe()
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
  
  data:any
  signup(){
    console.log(this.myForm)
   
    if(this.myForm?.valid){
      /*this.myForm.patchValue({
        emailUser:this.myForm.controls["emailClient"].value,telephoneUser:this.myForm.controls["telephoneClient"]
      })*/
      this.myForm.patchValue({entTarifId:Number(this.myForm.controls["entTarif"].value)})
      let data=new FormData()
data.append("societe",JSON.stringify(this.myForm.value))
data.append("image",this.image)
console.log("form data ")
console.log(data)
this.subscription2=this.backend.signup(data).subscribe((data)=>{console.log(data);
//this.backend.signup(this.myForm.value).subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.data=data.body.message
  console.log(this.data)
  this.dialogResult=true
  this.toaster.success(data.body.message,"Terminé avec succées")
    }
  },
    (error)=>{console.log("a problem when fetching the user from database")
    this.toaster.error(error.error,"Terminé avec echec")
    console.log(error)
              console.log(error.status)
              console.log(error.error)

  }
    ,()=>{this.dialogRef.close(this.dialogResult)
           console.log("login was successful")
          
  }
    )
}else{
  this.toaster.warning("verifier vos champs","Terminé avec echec")
  this.validateAllFields()
}
}
  reset(){

    this.myForm.setValue({
      password:"",username:"",name:"",
      emailClient:"",codeClient:"",intituleClient:"",matricule_fiscale:"",adresseClient:"",ville:"",codePostale:"",telephoneClient:"",
      entTarifId:0,entTarif:''
    })

      //this.displayEmailFormat=false
  //this.displayCodeUserRequired=false
  //this.displayIntituleRequired=false
  //this.displayMatriculeUserRequired=false
  //this.displayTelephoneUserRequired=false
  //this.displayTelephoneUserFormat=false
    this.displayPasswordRequired=false
  this.displayPasswordFormat=false
  this.displayEntTarifRequired=false
  this.displayUsernameRequired=false
  this.displayNameFormat=false
  this.displayNameRequired=false
  this.displayEmailClientFormat=false
  this.displayCodeClientRequired=false
  this.displayIntituleClientRequired=false
  this.displayMatricule_fiscaleRequired = false
  this.displayAdresseClientRequired= false
  this.displayCodePostaleFormat=false
  this.displayTelephoneClientRequired=false
  this.displayTelephoneClientFormat=false


 /* this.removeClassFromInput("emailUser")
  this.removeClassFromInput("codeUser")
  this.removeClassFromInput("intituleUser")
  this.removeClassFromInput("matriculeUser")
  this.removeClassFromInput("telephoneUser")
  */
  this.removeClassFromInput("password")
  this.removeClassFromInput("entTarif")

  this.removeClassFromInput("username")
  this.removeClassFromInput("name")

  this.removeClassFromInput("emailClient")
  this.removeClassFromInput("codeClient")
  this.removeClassFromInput("intituleClient")
  this.removeClassFromInput("matricule_fiscale")
  this.removeClassFromInput("adresseClient")
  this.removeClassFromInput("codePostale")
  this.removeClassFromInput("telephoneClient")
  }
  validateAllFields(){
    /*Validator() */
    this.tarifEntValidator()
    this.passwordValidator()
    this.usernameValidator()
    this.nameValidator()
    this.emailClientValidator()
    this.codeClientValidator()
    this.intituleClientValidator()
    this.matricule_fiscaleValidator()
    this.adresseClientValidator()
    this.codePostaleValidator()
    this.telephoneClientValidator()
  }
}
