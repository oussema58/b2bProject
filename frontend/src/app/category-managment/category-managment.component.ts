import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Catalogue } from '../models/catalogue';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCategoryComponent } from '../delete-category/delete-category.component';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CatalogueKeyPair2 } from '../models/CatalogueKeyPair2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { border } from 'ngx-bootstrap-icons';
/*
 selector: 'app-category-managment',
  templateUrl: './category-managment.component.html',
  styleUrls: ['./category-managment.component.css'],
  */
  @Component({
    selector: 'app-category-managment',
    templateUrl: './category-managment.component.html',
    styleUrls: ['./category-managment.component.css'],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({ height: '0px', minHeight: '0px'})),
        state('expanded', style({ height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
  })
export class CategoryManagmentComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private renderer:Renderer2){

  }

x="0"

currentLevel="all"
searchLevel="lvl1"


  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  subscription5!:Subscription
  canAdd=true
  canUpdate=true
  inEditMode=false
  inCreateMode=false
  //categoriesByCurrentLevel:Catalogue[]=[]
  categoriesByCurrentLevelDivided:CatalogueKeyPair2[]=[]
  categoriesDivided:CatalogueKeyPair2[]=[]
  categoriesDividedBackup:CatalogueKeyPair2[]=[]
  ngOnInit(): void {
    //this.getCategories()
    this.getCategoriesDivided()
  }
  addErrorClassToInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.addClass(elem,"inputError")
  }
  removeClassFromInput(id:string){
    let elem=document.getElementById(id)
    this.renderer.removeClass(elem,"inputError")
  }
  intituleCatalogue=""
catalogues:CatalogueKeyPair2[]=[]
cataloguesBackup:CatalogueKeyPair2[]=[]
intitule=""
level="3"
parentId="0"
catalogue:Catalogue|null=null
diplayIntituleRequired=false

dataSource!:MatTableDataSource<CatalogueKeyPair2>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns=["Intitule","Niveau","catalogueParent","Action","expand"]
  displayedColumnsWithoutExpand=["Intitule","Niveau","catalogueParent","Action"]

  expand(element:any){
    console.log("expand is working")
    console.log(element)
element.isExpanded=!element.isExpanded
console.log(element.isExpanded)
  }
  
  changeSearchLevel(){
    console.log(this.searchLevel)
  }
  filterCatalogues(){
    this.catalogues=[]
    if(this.intituleCatalogue==""){
for(let c of this.cataloguesBackup){
  this.catalogues.push(c)
}
this.dataSource.data=this.catalogues
return
    }
    if(this.searchLevel=="lvl1"){
      for(let c of this.cataloguesBackup){
        if(this.sameAsSearchLevel(c.name)){
          this.catalogues.push(c)
          
        }
      }
    }
    if(this.searchLevel=="lvl2"){
      for(let c of this.cataloguesBackup){
        let cat2List=[]
        for(let c2 of c.value){
          if(this.sameAsSearchLevel(c2.name)){
            cat2List.push(c2)
          }
        }
        if(cat2List.length!=0){
          let newCatalogue=new CatalogueKeyPair2(c.id,cat2List,c.name,c.parentId,c.niveau)
          
          this.catalogues.push(newCatalogue)
          /*c.value=cat2List
          this.catalogues.push(c)*/
        }
      }
    }
    if(this.searchLevel=="lvl3"){
      for(let c of this.cataloguesBackup){
        let cat2List=[]
        for(let c2 of c.value){
          let cat3List=[]
          for(let c3 of c2.value){
            if(this.sameAsSearchLevel(c3.name)){
              cat3List.push(c3)
            }
          }
          if(cat3List.length!=0){
            let newCatalogueLvl2=new CatalogueKeyPair2(c2.id,cat3List,c2.name,c2.parentId,c2.niveau)
            cat2List.push(newCatalogueLvl2)
            // c2.value=cat3List
            // cat2List.push(c2)
          }
        }
        if(cat2List.length!=0){
          let newCatalogue=new CatalogueKeyPair2(c.id,cat2List,c.name,c.parentId,c.niveau)
          this.catalogues.push(newCatalogue)

          // c.value=cat2List
          // this.catalogues.push(c)
        }
      }
    }
    this.dataSource.data=this.catalogues
  }
  sameAsSearchLevel(ch:string){
return ch.toLocaleLowerCase().startsWith(this.intituleCatalogue.toLocaleLowerCase()) ||
ch.split(" ").find((a)=>a.toLocaleLowerCase().startsWith(this.intituleCatalogue.toLocaleLowerCase()))
  }

getCategoriesDivided(){
  this.subscription1=this.backend.getAllCategoriesDividedEvenIfEmptyForAdmin().subscribe((data)=>{
     console.log(data.status)
     if(data.body!=null){
      console.log("content from api is")
      console.log(data.body)
      this.categoriesDivided=data.body
     console.log(this.categoriesDivided)
     //this.catalogues=data.body
     this.catalogues=[]
     this.cataloguesBackup=[]
     for(let c of data.body){
      let cat=new CatalogueKeyPair2(c.id,c.value,c.name,c.parentId,c.niveau)
      
      if(cat.value.length!=0){
        let cat2List:CatalogueKeyPair2[]=[]
        for(let c2 of cat.value){
          c2=new CatalogueKeyPair2(c2.id,c2.value,c2.name,c2.parentId,c2.niveau)
          cat2List.push(c2)
      }
      cat.value=cat2List
    }
this.catalogues.push(cat)
this.cataloguesBackup.push(cat)
    }
    console.log("normal catalgue equals")
  console.log(this.catalogues)
  console.log("iterating over is expanded")
  for(let c of this.catalogues){
    console.log(c.isExpanded)
        }
  this.dataSource=new MatTableDataSource<CatalogueKeyPair2>(this.catalogues)
      
this.dataSource.paginator=this.paginator
     
   }},(error)=>{
     console.log(error.status)
   console.log(error.error)
   },()=>{console.log("no problem")
   console.log("the divided categories are")
   console.log(this.categoriesDivided)
 //this.categorieOfParent()
 this.categoriesDividedBackup=this.categoriesDivided
 })
 }

/*getCategoriesDivided(){
 this.subscription1=this.backend.getAllCategoriesDividedEvenIfEmptyForAdmin().subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.categoriesDivided=data.body
    console.log(this.categoriesDivided)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
  console.log("the divided categories are")
  console.log(this.categoriesDivided)
//this.categorieOfParent()
this.categoriesDividedBackup=this.categoriesDivided
})
}*/

diplayIntituleFormatError=false
intituleValidator(){
  console.log("wait i am checking")
if(this.intitule==""){
  this.diplayIntituleFormatError=false
  this.diplayIntituleRequired=true
  this.addErrorClassToInput("intitule")
}else{
  this.diplayIntituleRequired=false
  if(this.intitule.match("^[A-Za-z][a-z]*( [A-Za-z][a-z]*)*$")){
    this.diplayIntituleFormatError=false
  this.removeClassFromInput("intitule")
}else{
  this.diplayIntituleFormatError=true
  this.addErrorClassToInput("intitule")
}
}
}
displayParentRequired=false
parentValidator(){
  if(this.parentId=="0" && this.level!="1"){
    this.displayParentRequired=true
    this.addErrorClassToInput("parentId")
  }else{
    if(this.level!="1"){
    this.removeClassFromInput("parentId")
  }
  this.displayParentRequired=false
  }
  console.log("i am in parent validator "+this.parentId)
}
/*
  getCategories(){
    this.subscription2=this.backend.getAllCategories().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.catalogues=data.body
      console.log(this.catalogues)
      this.dataSource=new MatTableDataSource<Catalogue>(this.catalogues)
    this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
  //this.categorieOfParent()
  this.cataloguesBackup=this.catalogues
  this.cataloguesBasedOnLevel=this.catalogues
  this.changeLevel()
})
  }
  */
  /*cataloguesBasedOnLevel:Catalogue[]=[]
  changeLevel(){
    if(this.currentLevel=="all"){
      this.cataloguesBasedOnLevel=this.cataloguesBackup
    }else{
      this.cataloguesBasedOnLevel=[]
      for(let cat of this.cataloguesBackup){
        if(cat.catalogueNiveau==Number(this.currentLevel)){
          this.cataloguesBasedOnLevel.push(cat)
        }
      }
    }
    console.log("cataloguues that should appear are catalogues with level "+this.currentLevel)
    console.log(this.cataloguesBasedOnLevel)
    this.change()
  }
  change(){
       if(this.intituleCatalogue==""){
         this.catalogues=this.cataloguesBasedOnLevel
       }else{
         this.catalogues=[]
         for(let cat of this.cataloguesBasedOnLevel){
           if(cat.catalogueIntitule.toLocaleLowerCase().startsWith(this.intituleCatalogue.toLocaleLowerCase()) ||
            cat.catalogueIntitule.split(" ").find((f)=> f.toLocaleLowerCase().startsWith(this.intituleCatalogue.toLocaleLowerCase()))){
             this.catalogues.push(cat)
           }
         }
       }
       this.dataSource.data=this.catalogues
     }*/
  

  // change(){
    
  //   if(this.intituleCatalogue==""){
  //     this.catalogues=this.cataloguesBackup
  //   }else{
  //     this.catalogues=[]
  //     for(let cat of this.cataloguesBackup){
  //       if(cat.catalogueIntitule.toLocaleLowerCase().startsWith(this.intituleCatalogue.toLocaleLowerCase()) ||
  //        cat.catalogueIntitule.split(" ").find((f)=> f.toLocaleLowerCase().startsWith(this.intituleCatalogue.toLocaleLowerCase()))){
  //         this.catalogues.push(cat)
  //       }
  //     }
  //   }
  //   this.dataSource.data=this.catalogues
  // }

 update(){
  this.canUpdate=true
    if(this.diplayIntituleRequired){
      this.toaster.warning("champ intitule est obligatoire","verifier vos champ")
     
    }
    if(!this.diplayIntituleRequired && this.diplayIntituleFormatError){
      this.toaster.warning("champ intitule doit etre formée par des lettres seulement","Verifier vos champs")
      
    }
    if(this.parentId=="0" && this.level!="1"){
      this.toaster.warning("Toutes les catégories, à l'exception de la catégorie racine, doivent avoir une catégorie parente."
      ,"verifier vos champs")
      this.canUpdate=false
      
    }
    if(this.canUpdate && !this.diplayIntituleRequired && !this.diplayIntituleFormatError){
  if(this.catalogue!=null){
    let parentId=0
    if(this.parentId!="0"){
      parentId=Number(this.parentId)
    }
    let catalogue=new Catalogue(0,this.intitule,Number(this.level),parentId)
 /* this.catalogue.catalogueNiveau=Number(this.level)
  this.catalogue.catalogueIntitule=this.intitule
  this.catalogue.catalogueParentId=Number(this.parentId)*/
  console.log("parent id "+this.parentId)
  console.log("old value of catalogue")
  console.log(this.catalogue)
  console.log("new value of catalogue")
  console.log(catalogue)
  this.subscription3=this.backend.updateCategory(catalogue,this.catalogue.catalogueId).subscribe({next:(data)=>{
    console.log("categorie is updated")
    this.toaster.success(data.body.message,"Terminé avec succées")
  },error:(error)=>{console.log(error)
    console.log(error.error)
    this.toaster.error(error.error,"Terminé avec echec")},
  complete:()=>{
    //this.getCategories()
    this.getCategoriesDivided()
    this.annuler()
    
  }})
}
    }
  }
  updateParentId(){
    console.log("//////////////// before  ///////////////////")
    console.log("parent  inside update parent is "+this.parentId)
    console.log("level  inside update parent is "+this.level)
    console.log("///////////////////////////////////")
    this.parentId="0"
    this.displayParentRequired=false
    this.removeClassFromInput("parentId")

    console.log("************* after  ***********")
    console.log("parent  inside update parent is "+this.parentId)
    console.log("level  inside update parent is "+this.level)
    console.log("**********************************")
  }
  create(){
    this.canAdd=true
    console.log(this.intitule)
    this.intituleValidator()
    this.parentValidator()
    if(this.diplayIntituleRequired){
      this.toaster.warning("champ intitule est obligatoire","Verifier vos champs")
      
    }
    if(!this.diplayIntituleRequired && this.diplayIntituleFormatError){
      this.toaster.warning("champ intitule doit etre formée par des lettres seulement","Verifier vos champs")
      
    }
    if(this.parentId=="0" && this.level!="1"){
      this.toaster.warning("Toutes les catégories, à l'exception de la catégorie racine, doivent avoir une catégorie parente.","Verifier vos champs")
      this.canAdd=false
      
      
    }
    
    if(this.canAdd && !this.diplayIntituleRequired && !this.diplayIntituleFormatError){
      console.log("request of create is send")
      console.log(this.intitule)
      console.log(this.level)
      console.log(this.parentId)
      let parentId=0
    if(this.parentId!="0"){
      parentId=Number(this.parentId)
    }
    this.catalogue=new Catalogue(0,this.intitule,Number(this.level),parentId)
    console.log(this.catalogue)
    this.subscription4=this.backend.addCategory(this.catalogue).subscribe((data)=>{
      console.log("categorie is added")
      this.toaster.success(data.body.message,"Terminé avec succées")
    },(error)=>{this.toaster.error(error.error,"Terminé avec echec")},
    ()=>{
      this.catalogue=null
      //this.getCategories()
      this.getCategoriesDivided()
     this.annuler()
    })
  }
  }
  delete(id:number){
    this.subscription5=this.backend.deleteCategory(id).subscribe((data)=>{
console.log(data.status)
console.log(data.body)
if(data.body!=null){
  this.toaster.success(data.body.message,"Terminé avec succées")
}
},(errror)=>{
this.toaster.error(errror.error,"Terminé avec echec")
},()=>{
  //this.getCategories()
this.getCategoriesDivided()
})
  }

  openEdit(catalogue:CatalogueKeyPair2){
    this.catalogue=new Catalogue(catalogue.id,catalogue.name,Number(this.level),catalogue.parentId)
    this.inEditMode=true
this.intitule=catalogue.name
this.level=String(catalogue.niveau)
//this.categorieOfParent()
console.log("i am in edit")
console.log(catalogue)
if(catalogue.parentId!=null){
console.log(this.parentId)
this.parentId=String(catalogue.parentId)
}else{
  this.parentId=""
}
console.log("parent id after transformation "+this.parentId)
  }
  /*openEdit(catalogue:Catalogue){
    this.catalogue=catalogue
    this.inEditMode=true
this.intitule=catalogue.catalogueIntitule
this.level=String(catalogue.catalogueNiveau)
//this.categorieOfParent()
console.log("i am in edit")
console.log(catalogue)
if(catalogue.catalogueParentId!=null){
console.log(this.parentId)
this.parentId=String(catalogue.catalogueParentId)
}else{
  this.parentId=""
}
console.log("parent id after transformation "+this.parentId)
  }*/
  openCreate(){
this.inCreateMode=true
//this.categorieOfParent()
  }
  annuler(){
    this.inEditMode=false
    this.inCreateMode=false
    this.catalogue=null
    //this.categoriesByCurrentLevel=[]
    //this.categoriesByCurrentLevelDivided=[]
    this.diplayIntituleRequired=false
this.displayParentRequired=false
    this.intitule=""
    this.level="3"
this.parentId="0"


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
    if(this.subscription5){
      this.subscription5.unsubscribe()
    }
  
  }
  validateAllFields(){
    /*Validator() */
    this.intituleValidator()
   
  }
  
  /*categorieOfParent(){

    console.log("inside categorie of parent method")
    console.log("level "+this.level)
    this.parentId=""
    this.categoriesByCurrentLevel=[]
    for(let cat of this.catalogues ){
      console.log(cat)
      if(cat.catalogueNiveau==Number(this.level)-1){
      this.categoriesByCurrentLevel.push(cat)
    }
    }
    

  }*/
}
