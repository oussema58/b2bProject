import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-account-modification',
  templateUrl: './confirm-account-modification.component.html',
  styleUrls: ['./confirm-account-modification.component.css']
})
export class ConfirmAccountModificationComponent implements OnDestroy {
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private ref:MatDialogRef<ConfirmAccountModificationComponent>,private router:Router,private formBuilder:FormBuilder,
  private toaster:ToastrService,private renderer:Renderer2,@Inject(MAT_DIALOG_DATA) private objectToSend:any ){
  
  }

  
  subscription1!:Subscription
  addErrorClassToInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.addClass(elem,"inputError")
  }
  removeClassFromInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.removeClass(elem,"inputError")
  }

  password=""
  displayPasswordRequired=false
  passwordValidator(){
    if(this.password==""){
      this.displayPasswordRequired=true
      this.addErrorClassToInput("passwordConfirmation")
    }else{
      this.displayPasswordRequired=false
      this.removeClassFromInput("passwordConfirmation")
    }
  }
  annuler(){
this.ref.close(false)
  }
  data:any
  update(){
    console.log(this.objectToSend)
   /* if(this.password!=""){
    let dataToSend=new FormData()
    let user={email:this.objectToSend.form.email,telephone:this.objectToSend.form.telephone,name:this.objectToSend.form.name,password:this.password}
    dataToSend.append("user1",JSON.stringify(user))
    dataToSend.append("image",this.objectToSend.image)
  this.subscription1=this.backend.updateUser(dataToSend).subscribe((data)=>{console.log(data);
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
        ,()=>{this.ref.close(true)
               console.log("login was successful")
              
      }
        )
    }else{
      this.toaster.warning("Terminé avec echéc","verifier les champs de formulaires")
    }*/
  }
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }

  }
}
