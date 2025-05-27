import { Component, Inject, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-update-societe-confirmation',
  templateUrl: './update-societe-confirmation.component.html',
  styleUrls: ['./update-societe-confirmation.component.css']
})
export class UpdateSocieteConfirmationComponent {
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private ref:MatDialogRef<UpdateSocieteConfirmationComponent>,private router:Router,private formBuilder:FormBuilder,
  private toaster:ToastrService,private renderer:Renderer2,@Inject(MAT_DIALOG_DATA) private objectToSend:any ){
  
  }

   ngOnInit(){
    console.log(this.objectToSend)
   }
idClient:any
  defaultImage="assets/images/avatar/societe.jpg"
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
    if(this.password!=""){
      this.idClient=this.storageService.getUser()?.idClient
    let dataToSend=new FormData()
    let societe={email:this.objectToSend.form.email,telephone:this.objectToSend.form.telephone,intitule:this.objectToSend.form.intitule,
      adresse:this.objectToSend.form.adresse,codePostale:this.objectToSend.form.codePostale,ville:this.objectToSend.form.ville,
      password:this.password}
      console.log(societe)
    dataToSend.append("societe1",JSON.stringify(societe))
    //dataToSend.append("societe1","aaaa")
    dataToSend.append("image",this.objectToSend.image)
  this.subscription1=this.backend.updateClient(dataToSend,this.idClient).subscribe((data)=>{console.log(data);
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
               
              
      }
        )
    }else{
      this.toaster.warning("Terminé avec echéc","verifier les champs de formulaires")
    }
  }
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }

  }

}
