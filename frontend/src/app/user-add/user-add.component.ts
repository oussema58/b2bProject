import { HttpClient } from '@angular/common/http';
import { Component, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordFormatValidator } from '../validators/PasswordFormat.validator';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {

  myForm!:FormGroup
  constructor(private http:HttpClient,private renderer:Renderer2,private router:Router,
    private storage:StorageService,private dialogRef:MatDialogRef<UserAddComponent>,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService,@Inject(MAT_DIALOG_DATA) public idClient:number){
  }
  subscription1!:Subscription
dialogResult=false
  ngOnInit(): void {
    this.myForm=this.formBuilder?.group(
      //userInfo
      {password:['',[Validators.required,PasswordFormatValidator]],
      email:['',EmailFormatValidator],telephone:['',Validators.pattern("[0-9]{8}")],
      username:['',[Validators.required]],name:['',[Validators.required,Validators.pattern("[A-Za-z][a-z]* [a-z]*")]],  
    }  
      )
    
  } 
  image!:File
    selectFile(event: any) {
      this.image = event.target.files.item(0);
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
  
  displayEmailFormat=false
  emailValidator(){
    
    console.log("email validator executing")
  if(this.myForm?.controls["email"].valid){
    this.removeClassFromInput("email")
  }else{
    this.addErrorClassToInput("email")
  } 
if(this.myForm?.controls["email"].hasError("EmailFormat")){
  this.displayEmailFormat=true
}
if(!this.myForm?.controls["email"].hasError("EmailFormat")){
  this.displayEmailFormat=false
}
  }

  //displayTelephoneUserRequired=false
  displayTelephoneFormat=false
  telephoneValidator() {
    if (this.myForm?.controls["telephone"].valid) {
      this.removeClassFromInput("telephone")
    }else {
      this.addErrorClassToInput("telephone")
    }    
      if(this.myForm?.controls["telephone"].hasError("pattern")){
         this.displayTelephoneFormat=true
       }
       if(!this.myForm?.controls["telephone"].hasError("pattern")){
         this.displayTelephoneFormat=false
       }
   }
   displayUsernameRequired=false
   usernameValidator(){
     if(this.myForm?.controls["username"].valid){
       this.removeClassFromInput("username")
       this.displayUsernameRequired=false
     }else{
       this.addErrorClassToInput("username")
       this.displayUsernameRequired=true
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

  close(){
    this.dialogRef.close()
  }
  ngOnDestroy(): void {
  this.reset()
  if(this.subscription1){
    this.subscription1.unsubscribe()
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
  create(){
    console.log(this.myForm)
   
    if(this.myForm?.valid){
      /*this.myForm.patchValue({
        emailUser:this.myForm.controls["emailClient"].value,telephoneUser:this.myForm.controls["telephoneClient"]
      })*/
      let data=new FormData()
data.append("user1",JSON.stringify(this.myForm.value))
data.append("image",this.image)
this.subscription1=this.backend.addUser(this.idClient,data).subscribe((data)=>{console.log(data);
//this.backend.addUser(this.idClient,this.myForm.value).subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.data=data.body.message
  console.log(this.data)
  this.dialogResult=true
  this.toaster.success("compte client ajoutée","Terminé avec succées",{disableTimeOut:true})
    }
  },
    (error)=>{console.log("Un problème lors de la récupération de l'utilisateur depuis la base de données.")
    this.toaster.error(error.error,"Terminé avec echec")
    console.log(error)
              console.log(error.status)
              console.log(error.error)

  }
    ,()=>{/*this.dialogRef.close(true)
           console.log("tout va bien")*/
          
  }
    )
}else{
  this.toaster.warning("verifier vos champs","Terminé avec echec")
  this.validateAllFields()
}
}
  reset(){

    this.myForm.setValue({
      password:"",username:"",name:"",email:"",telephone:""
    })
    this.displayPasswordRequired=false
  this.displayPasswordFormat=false
  this.displayUsernameRequired=false
  this.displayNameFormat=false
  this.displayNameRequired=false
this.displayTelephoneFormat=false
this.displayEmailFormat=false

  this.removeClassFromInput("password")
 this.removeClassFromInput("email")
  this.removeClassFromInput("telephone")
  this.removeClassFromInput("username")
  this.removeClassFromInput("name")
  }
validateAllFields(){
  this.passwordValidator()
  this.emailValidator()
  this.telephoneValidator()
  this.usernameValidator()
  this.nameValidator()
}
}
