import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tax } from '../models/tax';
import { Family } from '../models/family';
import { Catalogue } from '../models/catalogue';
import { Article } from '../models/article';
import { DecimalPipe } from '@angular/common';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { file } from 'ngx-bootstrap-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-update',
  templateUrl: './article-update.component.html',
  styleUrls: ['./article-update.component.css']
})
export class ArticleUpdateComponent implements OnInit,OnDestroy {
  myForm!:FormGroup
  constructor(private renderer:Renderer2,private router:Router,
    private storage:StorageService,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService,private dialogRef:MatDialogRef<ArticleUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Article){
  }

  level1Id=""
  level2Id=""
  catalogueDivided:CatalogueKeyPair[]=[]
  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  setCatalogueFields(){
    for(let cat1 of this.catalogueDivided){
       //this.level1Id=String(cat1.id)
       this.myForm.patchValue({
        level1:String(cat1.id)
       })
       this.changeCatalogueLevel1()
       for(let cat2 of cat1.value){
        //this.level2Id=String(cat2.id)
        this.myForm.patchValue({
          level2:String(cat2.id)
         })
         this.changeCatalogueLevel2()
        for(let cat3 of cat2.value){
          if(cat3.id==this.data.catalogue.catalogueId){
            this.myForm.patchValue({
              catalogue:String(this.data.catalogue.catalogueId)
             })
            console.log("i am inside setCatalogue field method lv1:"+this.level1Id+" lvl2:"+this.level2Id)
            return
          }
        }
       }
    }
   
  }
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
  this.setCatalogueFields()
})
  }
  

showLevel2=true
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

  showLevel3=true
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



  taxes:Tax[]=[]
  famillies:Family[]=[]
  catalogues:Catalogue[]=[]

  
  
  
  ngOnInit(): void {
    this.myForm=this.formBuilder.group({
      //articleCode:[this.data.articleCode,[Validators.required]],
      articleIntitule:[this.data.articleIntitule,[Validators.required]],
      articlePrixHT:[this.data.articlePrixHT,[Validators.min(0)]],
      description:[this.data.description,[Validators.required]],
      //articleBarCode:[this.data.articleBarCode,[Validators.required]], 
      articleEtat:[true],
      articleStatistique:[true],

      taxeId:[0],
      catalogueId:[0],
      familleId:[0],

      level1:[this.level1Id],
      level2:[this.level2Id],

      etat:[this.data.articleEtat?"1":""],
      statistique:[this.data.articleStatistique?"1":""],
      taxe:[String(this.data.taxe.id)],
      catalogue:[String(this.data.catalogue.catalogueId)],
      familly:[String(this.data.famille.familleId)]
    })
    this.getCategoriesDivided()
    this.getTaxs()
    //this.getCategoriesLevel3()
    this.getFamillies()
    console.log("my Initial form is ")
    console.log(this.myForm)
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
   image!:File
    selectFile(event: any) {
      this.image = event.target.files.item(0);
    }
  
/*
  displayArticleCodeRequired=false
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
   }
*/
   displayArticleIntituleRequired=false
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
   }else{
     this.displayArticlePrixHTMin=false
   }
    }
 /*
    displayArticleBarCodeRequired=false
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
     }
*/
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
      acceptedFileTypes=["image/jpeg","image/png"]
      displayImageTypeError=false
      imageValidators(){
        /*if(this.image==null){
          this.displayImageRequired=true
        }else{
          this.displayImageRequired=false
        }*/
        console.log("validating image")
        console.log(this.image)
        this.displayImageTypeError=false
        if(this.image!=null){
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
  ngOnDestroy(): void {
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
  
  }

  addErrorClassToInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.addClass(elem,"inputError")
  }
  removeClassFromInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.removeClass(elem,"inputError")
  }
  
  response:any
  update(){
    console.log(this.myForm)
    console.log(this.myForm.controls["taxe"].value)
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
      if(this.displayImageTypeError){
        this.toaster.error("tu dois ajouter une image avec format png ou jpeg")
        return
      }
      let data=new FormData()
data.append("article1",JSON.stringify(this.myForm.value))
data.append("image",this.image)
//this.backend.updateArticle(this.myForm.value,this.data.articleID).subscribe((data)=>{console.log(data);
this.subscription2=this.backend.updateArticle(data,this.data.articleID).subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.response=data.body.message
  console.log(this.data)
  this.toaster.success(data.body.message,"Terminé avec succès",{disableTimeOut:true})
    }
  },
    (error)=>{console.log("a problem when fetching the user from database ")
    this.toaster.error(error.error,"Terminé avec echec")
              console.log(error.status)
              console.log(error.error) 
  }
    ,()=>{this.dialogRef.close(true)
           console.log("update was successful")
          
  }
    )
}else{
  this.toaster.warning("verifier vos champs","Termine avec echec")
  this.validateAllFileds()
}
}
getTaxs(){
this.subscription4=this.backend.getTaxs().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.taxes=data.body
    console.log(this.taxes)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")})
}
/*
getCategoriesLevel3(){
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
  this.subscription3=this.backend.getAllFamillies().subscribe((data)=>{
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
      //articleCode:this.data.articleCode,
      articleIntitule:this.data.articleIntitule,
      articlePrixHT:this.data.articlePrixHT,
      //articleBarCode:this.data.articleBarCode,
      articleEtat:this.data.articleEtat,articleStatistique:this.data.articleStatistique,description:this.data.description,
      taxe:String(this.data.taxe.id),catalogue:String(this.data.catalogue.catalogueId),familly:String(this.data.famille.familleId),
      taxeId:0,catalogueId:0,familleId:0,etat:"1",statistique:"1"
      ,level1:this.level1Id,level2:this.level2Id
    })
    //this.displayArticleCodeRequired=false
  this.displayArticleIntituleRequired=false
  this.displayArticlePrixHTMin=false
  //this.displayArticleBarCodeRequired=false
  this.displayTaxeRequired=false
  this.displayCatalogueRequired=false
  this.displayFamillyRequired=false

  //this.removeClassFromInput("articleCode")
  this.removeClassFromInput("articleIntitule")
  this.removeClassFromInput("articlePrixHT")
  //this.removeClassFromInput("articleBarCode")
  this.removeClassFromInput("taxe")
  this.removeClassFromInput("familly")
  this.removeClassFromInput("catalogue")
  this.removeClassFromInput("description")
  }

  validateAllFileds(){
    /* validator() */
    this.descriptionValidator()
    this.articleIntituleValidator()
    this.articlePrixHTValidator()
    this.taxeValidator()
    this.famillyValidator()
    if(this.showLevel3){
    this.catalogueValidator()
  }
    this.imageValidators()
  }

}
