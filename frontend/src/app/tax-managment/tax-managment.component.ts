import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tax } from '../models/tax';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tax-managment',
  templateUrl: './tax-managment.component.html',
  styleUrls: ['./tax-managment.component.css']
})
export class TaxManagmentComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private formBuilder:FormBuilder,
    private renderer:Renderer2){

  }

  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  
  inEditMode=false
  inCreateMode=false
 idTax=0
 intituleTax=""
 taxs:Tax[]=[]
 taxsBackup:Tax[]=[]
  myForm!:FormGroup
  dataSource!:MatTableDataSource<Tax>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns=["Code","Intitule","Taux","Action"]
  ngOnInit(): void {
    this.getTaxs()
this.myForm=this.formBuilder.group({
  taxeCode:['',[Validators.required]],
  taxeIntitule:['',[Validators.required]],
  taxeTaux:[0,[Validators.min(0),Validators.max(100),Validators.required]]
  
})
  }
  displayTaxeMin=false
  displayTaxeMax=false
  displayTaxeRequired=false
  taxeTauxValidator(){
    if(this.myForm.controls["taxeTaux"].valid){
      this.removeClassFromInput("taxeTaux")
    }else{
      this.addErrorClassToInput("taxeTaux")
    }
    if(this.myForm.controls["taxeTaux"].hasError("required")){
      this.displayTaxeRequired=true
    }else{
      this.displayTaxeRequired=false
    }
    if(this.myForm.controls["taxeTaux"].hasError("max")){
      this.displayTaxeMax=true
    }else{
      this.displayTaxeMax=false
    }
    if(this.myForm.controls["taxeTaux"].hasError("min")){
      this.displayTaxeMin=true
    }else{
      this.displayTaxeMin=false
    }
  }

displayTaxeCodeRequired=false
taxeCodeValidator(){
  if(this.myForm.controls["taxeCode"].valid){
    this.removeClassFromInput("taxeCode")
  }else{
    this.addErrorClassToInput("taxeCode")
  }
  if(this.myForm.controls["taxeCode"].hasError("required")){
    this.displayTaxeCodeRequired=true
  }else{
    this.displayTaxeCodeRequired=false
  }
}
displayTaxeIntituleRequired=false
taxeIntituleValidator(){
  if(this.myForm.controls["taxeIntitule"].valid){
    this.removeClassFromInput("taxeIntitule")
  }else{
    this.addErrorClassToInput("taxeIntitule")
  }
  if(this.myForm.controls["taxeIntitule"].hasError("required")){
    this.displayTaxeIntituleRequired=true
  }else{
    this.displayTaxeIntituleRequired=false
  }
}

  getTaxs(){
   this.subscription1=this.backend.getTaxs().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.taxs=data.body.reverse()
      console.log(this.taxs)
      this.dataSource=new MatTableDataSource<Tax>(this.taxs)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
    this.taxsBackup=this.taxs
    })
  }
  change(){
    if(this.intituleTax==""){
      this.taxs=this.taxsBackup
    }else{
      this.taxs=[]
      for(let tax of this.taxsBackup){
        if(tax.taxeIntitule.toLocaleLowerCase().startsWith(this.intituleTax.toLocaleLowerCase()) ||
         tax.taxeIntitule.split(" ").find((t)=> t.toLocaleLowerCase().startsWith(this.intituleTax.toLocaleLowerCase()))){
          this.taxs.push(tax)
        }
      }
    }
    this.dataSource.data=this.taxs
  }
 update(){
  if(this.myForm.valid){
    this.myForm.patchValue({
      taxeCode:""})
  this.subscription2=this.backend.updateTax(this.myForm.value,this.idTax).subscribe({next:(data)=>{
    console.log("tax is updated")
    this.toaster.success(data.body.message,"Terminé avec succées",{disableTimeOut:true})
  },error:(error)=>{console.log(error)
    console.log(error.error)
    this.toaster.error(error.error,"Terminé avec echec")},
  complete:()=>{
    this.getTaxs()
    this.annuler()
    
  }})

}else{
  this.toaster.warning("verifier vos champ")
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
    this.subscription3=this.backend.addTax(this.myForm.value).subscribe((data)=>{
      console.log("family is added")
      this.toaster.success(data.body.message,"Terminé avec succées",{disableTimeOut:true})
    },(error)=>{
      console.log(error.error)
      this.toaster.error(error.error,"Terminé avec echec")},
    ()=>{
      this.getTaxs()
      
      this.annuler()
    })
  }else{
    this.toaster.warning("verifier vos champ")
  this.validateAllFields()
  }
}
  delete(id:number){
this.subscription4=this.backend.deleteTax(id).subscribe((data)=>{
  console.log(data.status)
  console.log(data.body)
  if(data.body!=null){
    this.toaster.success(data.body.message,"Terminé avec succées",{disableTimeOut:true})
  }
},(errror)=>{
this.toaster.error(errror.error,"Terminé avec echec")
},()=>{this.getTaxs()})
  }

  openEdit(tax:Tax){
    this.inEditMode=true
    this.inCreateMode=false
    this.idTax=tax.id
    this.myForm.setValue({
      taxeCode:tax.taxeCode,taxeIntitule:tax.taxeIntitule,taxeTaux:tax.taxeTaux
    })
    this.intituleTax=""
  }
  openCreate(){
this.inCreateMode=true
this.inEditMode=false
this.intituleTax=""
  }
  annuler(){
    this.inEditMode=false
    this.inCreateMode=false
    this.idTax=0
    this.myForm.setValue({
      taxeCode:"",taxeIntitule:"",taxeTaux:0
    })
    this.displayTaxeCodeRequired=false
    this.displayTaxeIntituleRequired=false
    this.displayTaxeMax=false
    this.displayTaxeMin=false
    this.displayTaxeRequired=false
    this.removeClassFromInput("taxeCode")
    this.removeClassFromInput("taxeIntitule")
this.removeClassFromInput("taxeTaux")
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
    this.taxeTauxValidator()
    this.taxeCodeValidator()
    this.taxeIntituleValidator()
  }
}
