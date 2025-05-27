import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Motif } from '../models/motif';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-motif-managment',
  templateUrl: './motif-managment.component.html',
  styleUrls: ['./motif-managment.component.css']
})
export class MotifManagmentComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,private formBuilder:FormBuilder,
    private renderer:Renderer2){

  }
 
  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  //inEditMode=false
  intituleMotif=""
  inCreateMode=false
 idFamily=0
  motifs:Motif[]=[]
  motifsBackup:Motif[]=[]
  myForm!:FormGroup
  dataSource!:MatTableDataSource<Motif>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns=["Code","Intitule","Action"]
  ngOnInit(): void {
    this.getMotifs()
this.myForm=this.formBuilder.group({
  code:['',[Validators.required]],
    intitule:['',[Validators.required]]
})
  }
displayCodeRequired=false
codeValidator(){
  if(this.myForm.controls["code"].valid){
    this.removeClassFromInput("code")
  }else{
    this.addErrorClassToInput("code")
  }
  if(this.myForm.controls["code"].hasError("required")){
    this.displayCodeRequired=true
  }else{
    this.displayCodeRequired=false
  }
}
displayIntituleRequired=false
intituleValidator(){
  if(this.myForm.controls["intitule"].valid){
    this.removeClassFromInput("intitule")
  }else{
    this.addErrorClassToInput("intitule")
  }
  if(this.myForm.controls["intitule"].hasError("required")){
    this.displayIntituleRequired=true
  }else{
    this.displayIntituleRequired=false
  }
}

  getMotifs(){
   this.subscription1=this.backend.getAllMotifs().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.motifs=data.body
      console.log(this.motifs)
      this.dataSource=new MatTableDataSource<Motif>(this.motifs)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
      this.motifsBackup=this.motifs
    })
  }
  change(){
    if(this.intituleMotif==""){
      this.motifs=this.motifsBackup
    }else{
      this.motifs=[]
      for(let client of this.motifsBackup){
        if(client.intitule.toLocaleLowerCase().startsWith(this.intituleMotif.toLocaleLowerCase()) ||
         client.intitule.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleMotif.toLocaleLowerCase()))){
          this.motifs.push(client)
        }
      }
    }
    this.dataSource.data=this.motifs
  }
 /*update(){
  if(this.myForm.valid){
  this.backend.updateFamily(this.myForm.value,this.idFamily).subscribe({next:(data)=>{
    console.log("family is updated")
    this.toaster.success(data.body.message,"update successful")
  },error:(error)=>{console.log(error)
    console.log(error.error)
    this.toaster.error(error.error,"update failed")},
  complete:()=>{
    this.getMotifs
    this.myForm.patchValue({
      familleCode:"",familleIntitule:""
    })
    this.inEditMode=false
  }})

}
}
*/
addErrorClassToInput(id:string){
  let elem=document.getElementById(id)
  this.renderer.addClass(elem,"inputError")
}
removeClassFromInput(id:string){
  let elem=document.getElementById(id)
  this.renderer.removeClass(elem,"inputError")
}

  create(){
    console.log(this.myForm)
    if(this.myForm.valid){
   this.subscription2=this.backend.addMotif(this.myForm.value).subscribe((data)=>{
      console.log("motif is added")
      this.toaster.success(data.body.message,"Terminé avec succées")
    },(error)=>{this.toaster.error(error.error,"Terminé avec echec")},
    ()=>{
      this.getMotifs()
      this.annuler()
    })
  }else{
    this.toaster.warning("verifier vos champs")
    this.validateAllFields()
  }
}
  delete(id:number){
   this.subscription3=this.backend.deleteMotif(id).subscribe((data)=>{
      console.log(data.status)
  console.log(data.body)
  if(data.body!=null){
    this.toaster.success(data.body.message,"Terminé avec succées")
  }
},(errror)=>{
this.toaster.error(errror.error,"Terminé avec echec")
},()=>{this.getMotifs()})
  }

  /*openEdit(fam:Family){
    this.inEditMode=true
    this.idFamily=fam.familleId
    this.myForm.setValue({
      familleCode:fam.familleCode,familleIntitule:fam.familleIntitule
    })
  }
  */
  openCreate(){
this.inCreateMode=true
  }
  annuler(){
   // this.inEditMode=false
    this.inCreateMode=false
    this.idFamily=0
    this.myForm.setValue({
      code:"",intitule:""
    })
    this.displayCodeRequired=false
    this.displayIntituleRequired=false
    this.removeClassFromInput("code")
    this.removeClassFromInput("intitule")
  }
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
    if(this.subscription2){
      this.subscription2.unsubscribe()
    }
    if(this.subscription3){
      this.subscription3.unsubscribe()
    }

  }
  validateAllFields(){
    this.codeValidator()
    this.intituleValidator()
  }
}

