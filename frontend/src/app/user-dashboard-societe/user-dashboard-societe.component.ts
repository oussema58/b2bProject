import { Component, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserDto } from '../models/userDto';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { Client } from '../models/client';
import { UpdateSocieteConfirmationComponent } from '../update-societe-confirmation/update-societe-confirmation.component';

@Component({
  selector: 'app-user-dashboard-societe',
  templateUrl: './user-dashboard-societe.component.html',
  styleUrls: ['./user-dashboard-societe.component.css']
})
export class UserDashboardSocieteComponent {
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private matDialog:MatDialog,private router:Router,private formBuilder:FormBuilder,
  private toaster:ToastrService,private renderer:Renderer2){
  
  }

 subscription1!:Subscription
 //subscription2!:Subscription
  data:any
  role:any
  username:any
  client!:Client
  defaultImage="assets/images/avatar/account.png"
  societeUpdateForm!:FormGroup
  clientId:any
  ngOnInit(): void {
    this.username=this.storageService.getUser()?.username
    console.log(this.username)
    this.clientId=this.storageService.getUser()?.idClient
    this.getClient()
     this.role=this.storageService.getUser()?.role
     console.log(this.role)
      }

      image!:File
    selectFile(event: any) {
      this.image = event.target.files.item(0);
    }

    getClient(){
     this.subscription1=this.backend.getClient(this.clientId).subscribe((data)=>{
        console.log(data)
  if(data.body!=null){
console.log(data)
console.log(data.body)
  this.client=data.body
  }
      },(error)=>{console.log("il y a un erreur")},
    ()=>{
      
      this.societeUpdateForm=this.formBuilder?.group(
        //userInfo
        {intitule:[this.client.intitule,[Validators.required]],email:[this.client.email,[EmailFormatValidator]],
          telephone:[this.client.telephone,[Validators.required,Validators.pattern("[0-9]{8}")]],
        
        adresse:[this.client.adresse,[Validators.required]],ville:[this.client.ville],codePostale:[this.client.codePostale]
      }  
        )
    })
    }
    displayIntituleRequired=false
    intituleValidator(){
    
      console.log("email validator executing")
    if(this.societeUpdateForm?.controls["intitule"].valid){
      this.removeClassFromInput("intitule")
    }else{
      this.addErrorClassToInput("intitule")
    } 
  if(this.societeUpdateForm?.controls["intitule"].hasError("required")){
    this.displayIntituleRequired=true
  }
  if(!this.societeUpdateForm?.controls["intitule"].hasError("required")){
    this.displayIntituleRequired=false
  }
    }
    displayEmailFormat=false
  emailValidator(){
    
    console.log("email validator executing")
  if(this.societeUpdateForm?.controls["email"].valid){
    this.removeClassFromInput("email")
  }else{
    this.addErrorClassToInput("email")
  } 
if(this.societeUpdateForm?.controls["email"].hasError("EmailFormat")){
  this.displayEmailFormat=true
}
if(!this.societeUpdateForm?.controls["email"].hasError("EmailFormat")){
  this.displayEmailFormat=false
}
  }
  
  displayTelephoneFormat=false
  displayTelephoneRequired=false
  telephoneValidator() {
    if (this.societeUpdateForm?.controls["telephone"].valid) {
      this.removeClassFromInput("telephone")
    }else {
      this.addErrorClassToInput("telephone")
    }   
    if(this.societeUpdateForm?.controls["telephone"].hasError("required")){
      this.displayTelephoneRequired=true
    }
    if(!this.societeUpdateForm?.controls["telephone"].hasError("required")){
      this.displayTelephoneRequired=false
    } 
      if(this.societeUpdateForm?.controls["telephone"].hasError("pattern")){
         this.displayTelephoneFormat=true
       }
       if(!this.societeUpdateForm?.controls["telephone"].hasError("pattern")){
         this.displayTelephoneFormat=false
       }
   }
   displayAdressRequired=false
   adresseValidator() {
     if (this.societeUpdateForm?.controls["adresse"].valid) {
       this.removeClassFromInput("adresse")
     } else {
       this.addErrorClassToInput("adresse")
     }
     if(this.societeUpdateForm?.controls["adresse"].hasError("required")){
       this.displayAdressRequired=true
      }else{
      this.displayAdressRequired=false
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
  
      openUpdateSocieteConfirmation(){
        let matRef
        if(this.client.intitule==this.societeUpdateForm.controls["intitule"].value && this.client.telephone==this.societeUpdateForm.controls["telephone"].value &&
        this.client.email==this.societeUpdateForm.controls["email"].value && this.client.adresse==this.societeUpdateForm.controls["adresse"].value
         && this.image==null && this.client.ville==this.societeUpdateForm.controls["ville"].value && this.client.codePostale==this.societeUpdateForm.controls["codePostale"].value){
          this.toaster.warning("aucun modification est fait");
          return
        }
        if(this.societeUpdateForm.valid){
          let objectToSend={form:this.societeUpdateForm.value,image:this.image}
          matRef=this.matDialog.open(UpdateSocieteConfirmationComponent,{
            width:"90%",data:objectToSend
        })
        }else{
          this.toaster.warning("verifier vos champs");
        }
        matRef?.afterClosed().subscribe((data)=>{
if(data){
  this.getClient()
  this.resetImage()
}
        })  
    }
    resetImage(){
      let f1=document.getElementById("f1") as HTMLInputElement
      f1.value=""
    }
    
    ngOnDestroy(): void {
      if(this.subscription1){
        this.subscription1.unsubscribe()
      }
      /*
      if(this.subscription2){
        this.subscription2.unsubscribe()
      }*/
    
    }
}
