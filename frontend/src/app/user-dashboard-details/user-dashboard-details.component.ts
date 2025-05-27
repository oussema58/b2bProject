import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDto } from '../models/userDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { ConfirmAccountModificationComponent } from '../confirm-account-modification/confirm-account-modification.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ComponentCommunicator } from '../services/componentCommunicator.service';

@Component({
  selector: 'app-user-dashboard-details',
  templateUrl: './user-dashboard-details.component.html',
  styleUrls: ['./user-dashboard-details.component.css']
})
export class UserDashboardDetailsComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private matDialog:MatDialog,private router:Router,private formBuilder:FormBuilder,
  private toaster:ToastrService,private renderer:Renderer2,private panierCommunicator:ComponentCommunicator){
  
  }

 subscription1!:Subscription
 subscription2!:Subscription
  data:any
  role:any
  username:any
  user!:UserDto
  defaultImage="assets/images/avatar/account.png"
  userUpdateForm!:FormGroup
  passwordUpdateForm!:FormGroup
  ngOnInit(): void {
    this.username=this.storageService.getUser()?.username
    console.log(this.username)
    this.getUser()
     this.role=this.storageService.getUser()?.role
     console.log(this.role)
    
 
      }

      image!:File
    selectFile(event: any) {
      this.image = event.target.files.item(0);
    }

    getUser(){
     this.subscription1=this.backend.getUser().subscribe((data)=>{
        console.log(data)
  if(data.body!=null){
console.log(data)
console.log(data.body)
  this.user=data.body
  }
      },(error)=>{console.log("il y a un erreur")},
    ()=>{
      this.userUpdateForm=this.formBuilder?.group(
        //userInfo
        {email:[this.user.email,EmailFormatValidator],telephone:[this.user.phoneNumber,Validators.pattern("[0-9]{8}")],
        name:[this.user.name,[Validators.required,Validators.pattern("[A-Za-z][a-z]*( [A-Za-z][a-z]*)+")]],  
      }  
        )
        this.passwordUpdateForm=this.formBuilder?.group(
          //userInfo
          {password:['',[Validators.required]],
          passwordConfirm:['',[Validators.required]],
          newPassword:['',[Validators.required,]],  
        }  
          )
    })
    }
    displayEmailFormat=false
  emailValidator(){
    
    console.log("email validator executing")
  if(this.userUpdateForm?.controls["email"].valid){
    this.removeClassFromInput("email")
  }else{
    this.addErrorClassToInput("email")
  } 
if(this.userUpdateForm?.controls["email"].hasError("EmailFormat")){
  this.displayEmailFormat=true
}
if(!this.userUpdateForm?.controls["email"].hasError("EmailFormat")){
  this.displayEmailFormat=false
}
  }
  
  displayTelephoneFormat=false
  telephoneValidator() {
    if (this.userUpdateForm?.controls["telephone"].valid) {
      this.removeClassFromInput("telephone")
    }else {
      this.addErrorClassToInput("telephone")
    }    
      if(this.userUpdateForm?.controls["telephone"].hasError("pattern")){
         this.displayTelephoneFormat=true
       }
       if(!this.userUpdateForm?.controls["telephone"].hasError("pattern")){
         this.displayTelephoneFormat=false
       }
   }
   displayNameRequired=false
   displayNameFormat=false
   nameValidator() {
     if (this.userUpdateForm?.controls["name"].valid) {
       this.removeClassFromInput("name")
     } else {
       this.addErrorClassToInput("name")
     }
     if(this.userUpdateForm?.controls["name"].hasError("required")){
       this.displayNameRequired=true
           }else{
             this.displayNameRequired=false
           }
           
       if(this.userUpdateForm?.controls["name"].hasError("pattern")){
         this.displayNameFormat=true
       }
       if(!this.userUpdateForm?.controls["name"].hasError("pattern")){
         this.displayNameFormat=false
       }
   } 
   displayPasswordRequired=false
   passwordValidator(){
    if (this.passwordUpdateForm?.controls["password"].valid) {
      this.removeClassFromInput("password")
    } else {
      this.addErrorClassToInput("password")
    }
    if(this.passwordUpdateForm?.controls["password"].hasError("required")){
      this.displayPasswordRequired=true
          }else{
            this.displayPasswordRequired=false
          }
   }
   displayPasswordConfirmRequired=false
   passwordConfirmValidator(){
    if (this.passwordUpdateForm?.controls["passwordConfirm"].valid) {
      this.removeClassFromInput("passwordConfirm")
    } else {
      this.addErrorClassToInput("passwordConfirm")
    }
    if(this.passwordUpdateForm?.controls["passwordConfirm"].hasError("required")){
      this.displayPasswordConfirmRequired=true
          }else{
            this.displayPasswordConfirmRequired=false
          }
   }
   displayNewPasswordRequired=false
   newPasswordValidator(){
    if (this.passwordUpdateForm?.controls["newPassword"].valid) {
      this.removeClassFromInput("newPassword")
    } else {
      this.addErrorClassToInput("newPassword")
    }
    if(this.passwordUpdateForm?.controls["newPassword"].hasError("required")){
      this.displayNewPasswordRequired=true
          }else{
            this.displayNewPasswordRequired=false
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
  
      openUpdateAccountConfirmation(){
        let matRef
        if(this.user.name==this.userUpdateForm.controls["name"].value && this.user.phoneNumber==this.userUpdateForm.controls["telephone"].value &&
        this.user.email==this.userUpdateForm.controls["email"].value && this.image==null){
          this.toaster.warning("aucun modification est fait");
          return
        }
        if(this.userUpdateForm.valid){
          let objectToSend={form:this.userUpdateForm.value,image:this.image}
          matRef=this.matDialog.open(ConfirmAccountModificationComponent,{
            width:"90%",data:objectToSend
        })
        }else{
          this.toaster.warning("verifier vos champs");
        }
        matRef?.afterClosed().subscribe((data)=>{
if(data){
  this.getUser()
  this.resetImage()
  this.panierCommunicator.emitUpdateNavbarEvent()
}
        })  
    }
    resetImage(){
      let f1=document.getElementById("f1") as HTMLInputElement
      f1.value=""
    }
    updatePassword(){
      if(this.passwordUpdateForm.valid){
        this.subscription2=this.backend.updatePassword(this.passwordUpdateForm.value).subscribe((data)=>{console.log(data);
          console.log("status")
          console.log(data.status)
          if(data.body!=null){
            this.data=data.body.message
            console.log(this.data)
            this.toaster.success("Terminé avec succès",this.data,{disableTimeOut:true})
              }
            },
              (error)=>{console.log("a problem when fetching the user from database ")
              this.toaster.error("Terminé avec echéc",error.error)
                        console.log(error.status)
                        console.log(error.error) 
            }
              ,()=>{}
              )
      }else{
        this.toaster.warning("verifier vos champs");
      }
    }
    ngOnDestroy(): void {
      if(this.subscription1){
        this.subscription1.unsubscribe()
      }
      if(this.subscription2){
        this.subscription2.unsubscribe()
      }
    
    }
}
