import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Family } from '../models/family';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteFamilyComponent } from '../delete-family/delete-family.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-family-managment',
  templateUrl: './family-managment.component.html',
  styleUrls: ['./family-managment.component.css']
})
export class FamilyManagmentComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private formBuilder:FormBuilder,
    private renderer:Renderer2,private activated:ActivatedRoute,private router:Router){

  }

  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  idFamily=0
  inEditMode=false
  inCreateMode=false
  familliesBackup:Family[]=[]
  intituleFamille=""
  famillies:Family[]=[]
  myForm!:FormGroup
  dataSource!:MatTableDataSource<Family>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns=["Code","Intitule","Action"]
  ngOnInit(): void {
  this.getFamillies()
this.myForm=this.formBuilder.group({
  familleCode:['',[Validators.required]],
    familleIntitule:['',[Validators.required]]
})
  }
displayFamilleCodeRequired=false
familleCodeValidator(){
  if(this.myForm.controls["familleCode"].valid){
    this.removeClassFromInput("familleCode")
  }else{
    this.addErrorClassToInput("familleCode")
  }
  if(this.myForm.controls["familleCode"].hasError("required")){
    this.displayFamilleCodeRequired=true
  }else{
    this.displayFamilleCodeRequired=false
  }
}
displayFamilleIntituleRequired=false
familleIntituleValidator(){
  if(this.myForm.controls["familleIntitule"].valid){
    this.removeClassFromInput("familleIntitule")
  }else{
    this.addErrorClassToInput("familleIntitule")
  }
  if(this.myForm.controls["familleIntitule"].hasError("required")){
    this.displayFamilleIntituleRequired=true
  }else{
    this.displayFamilleIntituleRequired=false
  }
}

  getFamillies(){
   this.subscription1=this.backend.getAllFamillies().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.famillies=data.body
      console.log(this.famillies)
      // this.famillies=[]
      this.dataSource=new MatTableDataSource<Family>(this.famillies)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
    this.familliesBackup=this.famillies
  })
  }
  change(){
    if(this.intituleFamille==""){
      this.famillies=this.familliesBackup
    }else{
      this.famillies=[]
      for(let fam of this.familliesBackup){
        if(fam.familleIntitule.toLocaleLowerCase().startsWith(this.intituleFamille.toLocaleLowerCase()) ||
         fam.familleIntitule.split(" ").find((f)=> f.toLocaleLowerCase().startsWith(this.intituleFamille.toLocaleLowerCase()))){
          this.famillies.push(fam)
        }
      }
    }
    this.dataSource.data=this.famillies
  }
 update(){
  /*this.canUpdate=true
    if(this.intitule==""){
      this.toaster.warning("intitule field is required","Check fields")
      this.canUpdate=false
    }
    if(this.parentId=="" && this.level!="1"){
      this.toaster.warning("other than root categhory other category should have a parent","Check fields")
      this.canUpdate=false
    }*/
  /*if(this.catalogue!=null){
  this.catalogue.catalogueNiveau=Number(this.level)
  this.catalogue.catalogueIntitule=this.intitule
  this.catalogue.catalogueParentId=Number(this.parentId)
  console.log("parent id "+this.parentId)
  console.log(this.catalogue)*/
  if(this.myForm.valid){
 this.subscription2=this.backend.updateFamily(this.myForm.value,this.idFamily).subscribe({next:(data)=>{
    console.log("family is updated")
    this.toaster.success(data.body.message,"Terminé avec succées")
  },error:(error)=>{console.log(error)
    console.log(error.error)
    this.toaster.error(error.error,"Terminé avec echec")},
  complete:()=>{
    this.getFamillies()
    this.annuler()
  }})

}else{
  this.toaster.warning("verifier vos champs")
  this.validateAllFields()
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

  create(){
    console.log(this.myForm)
    if(this.myForm.valid){
   this.subscription3=this.backend.addFamily(this.myForm.value).subscribe((data)=>{
      console.log("family is added")
      this.toaster.success(data.body.message,"Terminé avec succées")
    },(error)=>{this.toaster.error(error.error,"Terminé avec echec")},
    ()=>{
      this.getFamillies()
      this.annuler()
    })
  }else{
    this.toaster.warning("verifier vos champs")
    this.validateAllFields()
  }
}
  delete(id:number){
   this.subscription4=this.backend.deleteFamily(id).subscribe((data)=>{
      console.log(data.status)
  console.log(data.body)
  if(data.body!=null){
    this.toaster.success(data.body.message,"Terminé avec succées")
  }
},(errror)=>{
this.toaster.error(errror.error,"Terminé avec echec")
},()=>{this.getFamillies()})
  }

  openEdit(fam:Family){
    this.inEditMode=true
    this.idFamily=fam.familleId
    this.myForm.setValue({
      familleCode:fam.familleCode,familleIntitule:fam.familleIntitule
    })
  }
  openCreate(){
this.inCreateMode=true
  }
  annuler(){
    this.inEditMode=false
    this.inCreateMode=false
    this.idFamily=0
    this.myForm.setValue({
      familleCode:"",familleIntitule:""
    })
    this.displayFamilleCodeRequired=false
    this.displayFamilleIntituleRequired=false
    this.removeClassFromInput("familleCode")
    this.removeClassFromInput("familleIntitule")
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
    if(this.subscription4){
      this.subscription4.unsubscribe()
    }
  
  }
  validateAllFields(){
    /*Validator() */
    this.familleCodeValidator()
    this.familleIntituleValidator()
  }

}
