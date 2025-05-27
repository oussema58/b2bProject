import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tax } from '../models/tax';
import { Family } from '../models/family';
import { Catalogue } from '../models/catalogue';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit,OnDestroy {
  myForm!:FormGroup
  constructor(private renderer:Renderer2,private router:Router,
    private storage:StorageService,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private dialogRef:MatDialogRef<ArticleAddComponent>){
  }

  catalogueDivided:CatalogueKeyPair[]=[]
  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  getCategoriesDivided(){
    this.subscription1=this.backend.getAllCategoriesDividedForAdmin().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.catalogueDivided=data.body
      console.log(this.catalogueDivided)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem the divided cataalogue is")
  console.log(this.catalogueDivided)
})
  }
 
showLevel2=false
level2!:CatalogueKeyPair[]
changeCatalogueLevel1(){
if(this.myForm.controls["level1"].value==""){
  this.showLevel2=false
  this.showLevel3=false
  this.level2=[]
  this.level3=[]
  this.myForm.patchValue({
  level2:"",catalogue:""
  })
}else{
for(let elem of this.catalogueDivided){
  if(elem.id==this.myForm.controls["level1"].value){
    this.level2=elem.value
    break
  }
}
this.showLevel2=true
}
  }

  showLevel3=false
  level3!:CatalogueKeyPair[]
  changeCatalogueLevel2(){
  if(this.myForm.controls["level2"].value==""){
    this.showLevel3=false
    this.level3=[]
    this.myForm.patchValue({
      catalogue:""
      })
  }else{
  for(let elem of this.level2){
    if(elem.id==this.myForm.controls["level2"].value){
      this.level3=elem.value
      break
    }
  }
  this.showLevel3=true
  }
    } 
image:any
displayImageTypeError=false
acceptedFileTypes=["image/jpeg","image/png"]
    selectFile(event: any) {
      this.image = event.target.files.item(0);
    
      // if(!this.acceptedFileTypes.includes(this.image.type)){
      //   this.displayImageTypeError=true
      //   this.image=null
      //   event.target.value=null
      // }else{
      //   this.displayImageTypeError=false
      // }
    }

  catalogues:Catalogue[]=[]
  taxes:Tax[]=[]
  famillies:Family[]=[]
  ngOnInit(): void {
    this.myForm=this.formBuilder.group({
      articleCode:["",[Validators.required,Validators.pattern("^[A-Za-z][A-Za-z0-9]*$")]],
      articleIntitule:["",[Validators.required,Validators.pattern("^[A-Za-z]+( [A-Za-z]+)*( [0-9])*$")]],
      articlePrixHT:[0,[Validators.min(0)]],
      articleBarCode:["",[Validators.required,Validators.pattern("[0-9]{13}")]], 
      articleEtat:[true],
      articleStatistique:[true],
      description:["",[Validators.required]],

      taxeId:[0],
      catalogueId:[0],
      familleId:[0],

      level1:[""],
      level2:[""],

      etat:["1"],
      statistique:["1"],
      taxe:[""],
      //catalogue:[""],
      catalogue:["",[Validators.required]],
      familly:[""]
    })
    this.getTaxs()
    //this.getCategoriesLevel3()
    this.getFamillies()
    this.getCategoriesDivided()
  
  }

  displayArticleCodeRequired=false
  displayArticleCodeFormat=false
  articleCodeValidator(){
   if(this.myForm?.controls["articleCode"].valid){
     this.removeClassFromInput("articleCode")
   }else{
     this.addErrorClassToInput("articleCode")
   }
   if(this.myForm?.controls["articleCode"].hasError("required")){
    this.displayArticleCodeRequired=true
  }else{
    this.displayArticleCodeRequired=false
  }
  if(this.myForm?.controls["articleCode"].hasError("pattern")){
    this.displayArticleCodeFormat=true
  }else{
    this.displayArticleCodeFormat=false
  }
   }
   displayArticleDescriptionRequired=false
   descriptionValidator(){
    if(this.myForm?.controls["description"].valid){
      this.removeClassFromInput("description")
    }else{
      this.addErrorClassToInput("description")
    }
    if(this.myForm?.controls["description"].hasError("required")){
     this.displayArticleDescriptionRequired=true
   }else{
    this.displayArticleDescriptionRequired=false
   }
   }

   displayArticleIntituleRequired=false
   displayArticleIntituleFormat=false
   articleIntituleValidator(){
    if(this.myForm?.controls["articleIntitule"].valid){
      this.removeClassFromInput("articleIntitule")
    }else{
      this.addErrorClassToInput("articleIntitule")
    }
    if(this.myForm?.controls["articleIntitule"].hasError("required")){
     this.displayArticleIntituleRequired=true
   }else{
     this.displayArticleIntituleRequired=false
   }
   if(this.myForm?.controls["articleIntitule"].hasError("pattern")){
    this.displayArticleIntituleFormat=true
  }else{
    this.displayArticleIntituleFormat=false
  }
    }
   displayArticlePrixHTMin=false
   articlePrixHTValidator(){
    if(this.myForm?.controls["articlePrixHT"].value<0){
      this.myForm?.controls["articlePrixHT"].setErrors({min:true})
    }else{
      this.myForm?.controls["articlePrixHT"].setErrors(null)
    }
    if(this.myForm?.controls["articlePrixHT"].valid){
      this.removeClassFromInput("articlePrixHT")
    }else{
      this.addErrorClassToInput("articlePrixHT")
    }
    if(this.myForm?.controls["articlePrixHT"].hasError("min")){
     this.displayArticlePrixHTMin=true
     this.myForm?.controls["articlePrixHT"].setValue(0)
   }else{
     this.displayArticlePrixHTMin=false
   }
    }
 
    displayArticleBarCodeRequired=false
    displayArticleBarCodeFormat=false
    articleBarCodeValidator(){
     if(this.myForm?.controls["articleBarCode"].valid){
       this.removeClassFromInput("articleBarCode")
     }else{
       this.addErrorClassToInput("articleBarCode")
     }
     if(this.myForm?.controls["articleBarCode"].hasError("required")){
      this.displayArticleBarCodeRequired=true
    }else{
      this.displayArticleBarCodeRequired=false
    }
    if(this.myForm?.controls["articleBarCode"].hasError("pattern")){
      this.displayArticleBarCodeFormat=true
    }else{
      this.displayArticleBarCodeFormat=false
    }
     }

     displayTaxeRequired=false
     taxeValidator(){
      if(this.myForm?.controls["taxe"].value==""){
        this.myForm?.controls["taxe"].setErrors({required:true})
      }else{
        this.myForm?.controls["taxe"].setErrors(null)
      }
      if(this.myForm?.controls["taxe"].valid){
        this.removeClassFromInput("taxe")
      }else{
        this.addErrorClassToInput("taxe")
      }
      if(this.myForm?.controls["taxe"].hasError("required")){
       this.displayTaxeRequired=true
     }else{
       this.displayTaxeRequired=false
     }
      }
      
      displayCatalogueRequired=false
      catalogueValidator(){
        if(this.myForm?.controls["catalogue"].value==""){
          this.myForm?.controls["catalogue"].setErrors({required:true})
        }else{
          this.myForm?.controls["catalogue"].setErrors(null)
        }
      if(this.myForm?.controls["catalogue"].valid){
        this.removeClassFromInput("catalogue")
      }else{
        this.addErrorClassToInput("catalogue")
      }
      if(this.myForm?.controls["catalogue"].hasError("required")){
       this.displayCatalogueRequired=true
     }else{
       this.displayCatalogueRequired=false
     }
      }
      
      displayFamillyRequired=false
      famillyValidator(){
        if(this.myForm?.controls["familly"].value==""){
          this.myForm?.controls["familly"].setErrors({required:true})
        }else{
          this.myForm?.controls["familly"].setErrors(null)
        }
      if(this.myForm?.controls["familly"].valid){
        this.removeClassFromInput("familly")
      }else{
        this.addErrorClassToInput("familly")
      }
      if(this.myForm?.controls["familly"].hasError("required")){
       this.displayFamillyRequired=true
     }else{
       this.displayFamillyRequired=false
     }
      }




      displayImageRequired=false
      imageValidators(){
        console.log("validating image")
        console.log(this.image)
        
        if(this.image==null){
          this.displayImageRequired=true          
          this.addErrorClassToInput("image")
        }else{

          this.displayImageRequired=false
          if(!this.acceptedFileTypes.includes(this.image.type)){
            this.addErrorClassToInput("image")
            this.displayImageTypeError=true
            // this.image=null
            
          }else{
            this.displayImageTypeError=false
            this.removeClassFromInput("image")
          }
          
        }
        
      }
  
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
  Add(){
    console.log(this.myForm)
    console.log(this.myForm.controls["taxe"].value)
    console.log("catalogue id in form")
    console.log(this.myForm.controls["catalogue"].value)
    console.log(this.myForm.controls["familly"].value)
    console.log(this.myForm.controls["etat"].value)
    console.log(this.myForm.controls["statistique"].value)
    if(this.myForm?.valid){
      this.myForm.patchValue({
        taxeId:Number(this.myForm.controls["taxe"].value),
      catalogueId:Number(this.myForm.controls["catalogue"].value),
      familleId:Number(this.myForm.controls["familly"].value),
      articleEtat:Boolean(this.myForm.controls["etat"].value),
      articleStatistique:Boolean(this.myForm.controls["statistique"].value),
      })
      if(this.displayImageRequired || this.displayImageTypeError){
        this.toaster.error("tu dois ajouter une image avec format png ou jpeg")
        return
      }
let data=new FormData()
data.append("article1",JSON.stringify(this.myForm.value))
data.append("image",this.image)
this.subscription2=this.backend.addArticle(data).subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.data=data.body.message
  console.log(this.data)
  this.toaster.success(this.data,"Terminé avec succès",{disableTimeOut:true})
    }
  },
    (error)=>{console.log("a problem when fetching the user from database ")
    this.toaster.error(error.error,"Terminé avec echéc")
              console.log(error.status)
              console.log(error.error) 
  }
    ,()=>{this.dialogRef.close(true)
           console.log("login was successful")
           
          
  }
    )
}else{
  this.toaster.warning("verifier les champs de formulaires")
  this.validateAllFileds()
}
}
getTaxs(){
  this.subscription3=this.backend.getTaxs().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.taxes=data.body
    console.log(this.taxes)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")})
}
/*getCategoriesLevel3(){
  this.backend.getCategorieLevel3().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.catalogues=data.body
    console.log(this.catalogues)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")})
}*/
getFamillies(){
  this.subscription4=this.backend.getAllFamillies().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.famillies=data.body
    console.log(this.famillies)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")})
}
  reset(){

    this.myForm.setValue({
      articleCode:"",articleIntitule:"",articlePrixHT:0,articleBarCode:"",description:"",articleEtat:true,
      articleStatistique:true,taxe:"",catalogue:"",familly:"",taxeId:0,catalogueId:0,familleId:0,etat:"1",statistique:"1"
      ,level1:"",level2:''
    })
    this.displayArticleCodeRequired=false
  this.displayArticleIntituleRequired=false
  this.displayArticlePrixHTMin=false
  this.displayArticleBarCodeRequired=false
  this.displayTaxeRequired=false
  this.displayCatalogueRequired=false
  this.displayFamillyRequired=false
  this.displayImageRequired=false

  this.removeClassFromInput("articleCode")
  this.removeClassFromInput("articleIntitule")
  this.removeClassFromInput("articlePrixHT")
  this.removeClassFromInput("articleBarCode")
  this.removeClassFromInput("taxe")
  this.removeClassFromInput("familly")
  this.removeClassFromInput("catalogue")
  this.removeClassFromInput("level1")
  this.removeClassFromInput("level2")
  }
  ngOnDestroy(){
    this.reset()
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
    console.log("unsubcription of add article component")
  }
  validateAllFileds(){
    /* validator() */
    this.articleCodeValidator()
    this.descriptionValidator()
    this.articleIntituleValidator()
    this.articlePrixHTValidator()
    this.articleBarCodeValidator()
    this.taxeValidator()
    this.famillyValidator()
    if(this.showLevel3){
    this.catalogueValidator()
  }
    this.imageValidators()
  }
}
