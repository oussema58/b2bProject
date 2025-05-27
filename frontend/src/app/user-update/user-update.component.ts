import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordFormatValidator } from '../validators/PasswordFormat.validator';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateClientComponent } from '../update-client/update-client.component';
import { Client } from '../models/client';
import { User } from '../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit,OnDestroy {
  myForm!:FormGroup
  constructor(private http:HttpClient,private renderer:Renderer2,private router:Router,
    private storage:StorageService,private dialogRef:MatDialogRef<UserUpdateComponent>,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService,@Inject(MAT_DIALOG_DATA) public dataDialog:User){
  }
  subscription1!:Subscription
dialogResult=false
  ngOnInit(): void {
    this.myForm=this.formBuilder?.group(
      {email:[this.dataDialog.email,[EmailFormatValidator]],
      telephone:[this.dataDialog.phoneNumber,[Validators.pattern("[0-9]{8}")]],
      name:[this.dataDialog.name,[Validators.required,Validators.pattern("([A-Za-z][a-z]* )+[A-Za-z][a-z]*")]],
      etat:[this.dataDialog.etat],
      status:[this.dataDialog.etat?"ACTIVE":"INACTIVE"],
      //username:[this.dataDialog.userName,[Validators.required]],
      password:[""]
    }  
      )
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
  
  displayTelephoneRequired=false
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
         this.  displayTelephoneFormat=false
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
           
       if(this.myForm?.controls["name"].hasError("pattern")){
         this.displayNameFormat=true
       }
       if(!this.myForm?.controls["name"].hasError("pattern")){
         this.displayNameFormat=false
       }
   } 
   displayUsernameRequired=false
   /*usernameValidator() {
    if (this.myForm?.controls["username"].valid) {
      this.removeClassFromInput("username")
    } else {
      this.addErrorClassToInput("username")
    }
    if(this.myForm?.controls["username"].hasError("required")){
      this.displayUsernameRequired=true
          }else{
            this.displayUsernameRequired=false
          }
  } */
  
  close(){
    this.dialogRef.close()
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
  image!:File
  selectFile(event: any) {
    this.image = event.target.files.item(0);
  }
  update(){
    console.log(this.myForm)   
    if(this.myForm?.valid){
      if(this.myForm.controls["status"].value=="ACTIVE"){
        this.myForm.patchValue({
          etat:true
        })
      }else{
          this.myForm.patchValue({
            etat:false
          })
      }
      let formData:FormData=new FormData()
      formData.append("user1",JSON.stringify(this.myForm.value))
      formData.append("image",this.image)
this.subscription1=this.backend.updateUser(formData,this.dataDialog.id).subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.data=data.body.message
  console.log(this.data)
  this.dialogResult=true
  this.toaster.success(this.data,"Terminé avec succées")
    }
  },
    (error)=>{console.log("a problem when fetching the user from database ")
    this.toaster.error(error.error,"Terminé avec echec")
              console.log(error.status)
              console.log(error.error) 
  }
    ,()=>{this.dialogRef.close(this.dialogResult)
           console.log("login was successful")
          
  }
    )
}else{
  this.toaster.warning("check your fields","Sign Up failed")
  this.validateAllFields()
}
}
  reset(){

    this.myForm.setValue({
      email:this.dataDialog.email,telephone:this.dataDialog.phoneNumber,name:this.dataDialog.name,etat:this.dataDialog.etat,
      status:this.dataDialog.etat?"ACTIVE":"INACTIVE",password:""
      //username:this.dataDialog.userName
    })
  this.displayEmailFormat=false
  this.displayTelephoneRequired=false
  this.displayTelephoneFormat=false
  this.displayNameFormat=false
  this.displayNameRequired=false
  this.displayUsernameRequired=false

  this.removeClassFromInput("email")
  this.removeClassFromInput("telephone")
  this.removeClassFromInput("name")
  this.removeClassFromInput("username")

  }
  ngOnDestroy(): void {
    this.reset()
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
    
    }
    validateAllFields(){
      this.emailValidator()
      this.telephoneValidator()
      this.nameValidator()
      //this.usernameValidator()
    }
}
