import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PasswordFormatValidator } from '../validators/PasswordFormat.validator';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

myForm!:FormGroup
  constructor(private http:HttpClient,private renderer:Renderer2,private router:Router,
    private storage:StorageService,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService){
  }
subscription1!:Subscription
  ngOnInit(): void {
    this.myForm=this.formBuilder?.group(
      {password:['',[Validators.required]],username:['',[Validators.required]]}
      )
      if(this.storage.isConnected()){
        if(this.storage.getUser()?.role=="ADMIN"){
        this.router.navigate(['/dashboard'])
      }else{
        this.router.navigate(['/store'])
      }
      }
  }
  close(){
    //this.dialogRef.close()
  }
  
  cantSubmit=false
  displayUsernameRequired=false
  displayPasswordRequired=false
  addErrorClassToInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.addClass(elem,"inputError")
  }
  removeClassFromInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.removeClass(elem,"inputError")
  }
  
  usernameValidator(){
    
    console.log("username validator executing")
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
    
  }

  passwordValidator(){
    if(this.myForm?.controls["password"].valid){
      this.removeClassFromInput("password")
      this.displayPasswordRequired=false
    }else{
      this.addErrorClassToInput("password")
      this.displayPasswordRequired=true
}
  }
  data:any
  login(){
    console.log(this.myForm)
   
    if(this.myForm?.valid){
this.subscription1=this.backend.login(this.myForm.value).subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.data=data.body
  console.log(this.data)
  console.log("time to store token")
 this.storage.storeUser(this.data)
    }
  }
    ,
    (error)=>{console.log("a problem when fetching the user from database ")
              this.toaster.error(error.error,"Accès refusé")
              console.log(error.status)
              console.log(error.error) 
  }
 
    ,()=>{
          this.toaster.success("Accès autorisé","Bienvenue à nouveau")
           console.log("login was successful")
           
          if(this.data.role=="ADMIN"){
            this.router.navigate(['/dashboard'])
          
          
        }else{
          this.router.navigate(['/store'])
        }
        console.log("navigation successful")
  }
    )
}else{
  this.toaster.warning("verifier vos champ ")
  this.passwordValidator()
  this.usernameValidator()
}
}
  reset(){

    this.myForm.setValue({
      username:"",password:""
    })
    this.displayUsernameRequired=false
    this.displayPasswordRequired=false
    this.removeClassFromInput("password")
    this.removeClassFromInput("username")
  }
  ngOnDestroy(): void {
    this.reset()
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
  
    }
}
