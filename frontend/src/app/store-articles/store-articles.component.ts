import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { Article } from '../models/article';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { CommandLigne } from '../models/CommandLigne';
import { ArticleInStore } from '../models/ArticleInStore';
import { LignePanier } from '../models/LignePanier';
import { LignePanierDto } from '../models/LignePanierDto';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ComponentCommunicator } from '../services/componentCommunicator.service';

@Component({
  selector: 'app-store-articles',
  templateUrl: './store-articles.component.html',
  styleUrls: ['./store-articles.component.css']
})
export class StoreArticlesComponent implements OnInit,OnDestroy{
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private toaster:ToastrService,private matDialog:MatDialog,private router:Router,private storage:StorageService,
  private renderer:Renderer2,private panierCommunicator:ComponentCommunicator){
      
    }

subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
subscription4!:Subscription
subscription5!:Subscription
subscription6!:Subscription
    highestPrice=0
    lowestPrice=0
    highestPriceConst=0
    
articlesToOrderBackup:ArticleInStore[]=[]
    orderBy="date-desc"
navigateUsingSorting(){
  this.router.navigate(['/store/article/category/'+this.nameCategoryLvl1+'/'+this.nameCategoryLvl2+'/'+this.nameCategoryLvl3],
      {queryParams: { group: 1,show:this.articleByPage,highest:this.highestPrice,lowest:this.lowestPrice,order:this.orderBy}})
}

  orderArticles(){
    console.log('i am in order articles')
    
if(this.orderBy=="date"){
  this.articlesInStores=this.articlesInStores.sort((a,b)=>new Date(a.dateCreate).getTime()-new Date(b.dateCreate).getTime()).reverse()
}else if(this.orderBy=="date-desc"){
  this.articlesInStores=this.articlesInStores.sort((a,b)=>new Date(a.dateCreate).getTime()-new Date(b.dateCreate).getTime())
}
else if(this.orderBy=="price"){
  this.articlesInStores=this.articlesInStores.sort((a,b)=>a.tarifPrix-b.tarifPrix)
}else if(this.orderBy=="price-desc"){
  this.articlesInStores=this.articlesInStores.sort((a,b)=>a.tarifPrix-b.tarifPrix).reverse()
}
console.log("----------------------------")
console.log(this.articlesInStores)
console.log(this.articlesToOrderBackup)
console.log("--------------------")
console.log("-----------------------------------")
  }



filtrer(){
  this.articlesInStores=[]
  for(let elem of this.articlesInStoresBackup){
    if(elem.tarifPrix<=this.highestPrice && elem.tarifPrix>=this.lowestPrice){
      this.articlesInStores.push(elem)
    }
  }
  
}

priceFilterReady=false
    ready=false
    print(){
      console.log(this.checkbox)
    }
    //idCategoryLvl2:any
    nameCategoryLvl3:any
    nameCategoryLvl2:any
    nameCategoryLvl1:any
    catalogue1!:CatalogueKeyPair
    //catalogue2!:CatalogueKeyPair
    catalogue3:any
    checkbox:Map<string,boolean>=new Map()
    currentGroup=1
    articleByPage=4
    lastGroup=1
    featuredArticles:ArticleInStore[]=[]
navigateUsingFilter(){
  this.router.navigate(['/store/article/category/'+this.nameCategoryLvl1+'/'+this.nameCategoryLvl2+'/'+this.nameCategoryLvl3],
      {queryParams: { group: 1,show:this.articleByPage,highest:this.highestPrice,lowest:this.lowestPrice,order:this.orderBy}})
}
    navigate(){
      console.log("article by page "+this.articleByPage)
      //this.router.navigate(['/store/article/category/'+this.catalogue1Name+'/'+this.idCategoryLvl2+'/'+this.nameCategoryLvl3],{queryParams: { group: 1,show:this.articleByPage}})
      this.router.navigate(['/store/article/category/'+this.nameCategoryLvl1+'/'+this.nameCategoryLvl2+'/'+this.nameCategoryLvl3],
      {queryParams: { group: this.currentGroup,show:this.articleByPage,highest:this.highestPrice,lowest:this.lowestPrice,order:this.orderBy}})
    }

    /*getFeaturedArticlesInStore(){
     this.subscription1=this.backend.getFeaturedArticlesInStore().subscribe((data)=>{console.log(data);
      console.log("status")
      console.log(data.status)
      if(data.body!=null){
        this.featuredArticles=data.body
        
        console.log("featured articles are ")
        console.log(this.featuredArticles)
          }
        }
          ,
          (error)=>{console.log("a problem when fetching the user from database ")
                    console.log(error.status)
                    console.log(error.error) 
        }
          ,()=>{}
          )
      }*/
      bestSellingArticles:ArticleInStore[]=[]
getBestSellingArticlesInStore(){
  this.subscription4=this.backend.getBestSellingArticlesInStore().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.bestSellingArticles=data.body
    console.log("best selling articles are ")
    console.log(this.bestSellingArticles)
      }
    }
      ,
      (error)=>{console.log("a problem when fetching the user from database ")
                console.log(error.status)
                console.log(error.error) 
    }
      ,()=>{this.ready=true}
      )
  }
/*
    updateCheckbox(name:string){
      this.checkbox.set(name,!this.checkbox.get(name))
    }
*/  
navigateUsingCategory(art:ArticleInStore){
  let category3=art.catalogueIntitule
  this.subscription2=this.backend.findCategoryLevel3Parent(category3).subscribe((data)=>{
    if(data.body!=null){
      this.router.navigate(["/store/article/category/"+data.body.category1+"/"+data.body.category2+"/"+category3])
    }
  },(error)=>{
    console.log("erreur au cours du navigation")
  })

}  
doLogic(elem:HTMLElement,elem2:HTMLElement){
  if(elem.classList.contains("showSubMenu")){
    //this.renderer.setStyle(elem2,"display","none")
    this.renderer.removeClass(elem,"showSubMenu")
    this.renderer.addClass(elem,"hideSubMenu")
    
  }
  else if(elem.classList.contains("hideSubMenu")){
    //this.renderer.setStyle(elem2,"display","initial")
    this.renderer.removeClass(elem,"hideSubMenu")
    this.renderer.addClass(elem,"showSubMenu")
   
  }
  console.log(elem.classList)
 
}
    articlesInStores:ArticleInStore[]=[]
  ngOnInit(): void {  
console.log("******************************************************************")
    this.activated.paramMap.subscribe((params)=>{
  //this.idCategoryLvl2=params.get("categoryId")
  this.nameCategoryLvl2=params.get("category2Name")
  this.nameCategoryLvl3=params.get("category3Name")
  this.nameCategoryLvl1=params.get("category1Name")

  console.log("the level 1 catalogue id is "+ this.nameCategoryLvl1)
  //console.log("the level 2 catalogue id is "+ this.idCategoryLvl2)
  console.log("the level 2 catalogue id is "+this.nameCategoryLvl2)
  console.log("the level 3 catalogue name is "+ this.nameCategoryLvl3)
  console.log("******************************************************************")
  //this.getCategoryLevel2()
  //this.getArticles()
  this.getArticlesInStore()
    })
    this.getCategoryLevel1()
    //this.getFeaturedArticlesInStore() 
     this.getBestSellingArticlesInStore()
  }
  articlesInStoresBackup:ArticleInStore[]=[]
  determineHighestPrice(){
    this.articlesInStoresBackup.forEach((val)=>{if(this.highestPriceConst<val.tarifPrix){
      this.highestPriceConst=val.tarifPrix
            }})
            
            
  }
  getArticlesInStore(){

    this.subscription3=this.backend.getArticlesInStoreByCategoryLvl3(this.nameCategoryLvl3).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){

      this.articlesInStores=data.body
      this.articlesInStoresBackup=this.articlesInStores
  
      console.log("store articles")
      this.priceFilterReady=true

      console.log(this.articlesInStores)
      
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    if(error.status==404){
      this.router.navigate(["/notFound"])
    }
    },()=>{
      
      console.log("no problem")
      if(this.articlesInStoresBackup.length==0){
        this.toaster.error("cet categorie n'est pas disponible")
        this.router.navigate(["/store"])
      }
      //this.orderArticles()
      this.activated.queryParams.subscribe(params => {
        this.currentGroup = Number(params['group']);
        this.articleByPage=Number(params["show"])
        this.determineHighestPrice()
        if(params["highest"]==null){
          this.highestPrice=this.highestPriceConst
        }else{
          this.highestPrice=Number(params['highest']);
        }
        if(params["order"]==null){
          this.orderBy="date"
        }else{
          this.orderBy=params['order'];
        }
        if(params["lowest"]==null){
          this.lowestPrice=0
        }else{
          this.lowestPrice=Number(params['lowest']);
        }
        console.log("current group is "+this.currentGroup)
        console.log("show is "+this.articleByPage)
        this.filtrer()
        this.orderArticles()
        this.articlesGrouping()
        
      });  
  }
    )
  }
noArticleFound=false
articlesGrouping(){
  this.noArticleFound=false
  if(this.articlesInStores.length==0){
    this.currentGroup=0
    this.lastGroup=0
this.noArticleFound=true
    return;
  }
  if(Number.isNaN(this.currentGroup) || ![4,8,16].includes(this.articleByPage) ){
    //this.router.navigate(['/store/article/category/'+this.idCategoryLvl2+'/'+this.nameCategoryLvl3],{queryParams: { group: 1,show:4}})
    this.router.navigate(['/store/article/category/'+this.nameCategoryLvl1+'/'+this.nameCategoryLvl2+'/'+this.nameCategoryLvl3],
    {queryParams: { group: 1,show:4,highest:this.highestPrice,lowest:this.lowestPrice}})
  }
  this.lastGroup=Math.ceil(this.articlesInStores.length/this.articleByPage)

  if(Number.isNaN(this.currentGroup) || this.currentGroup<0 || this.currentGroup>this.lastGroup){
    //this.router.navigate(['/store/article/category/'+this.idCategoryLvl2+'/'+this.nameCategoryLvl3],{queryParams: { group: 1,show:4}})
    this.router.navigate(['/store/article/category/'+this.nameCategoryLvl1+'/'+this.nameCategoryLvl2+'/'+this.nameCategoryLvl3],
    {queryParams: { group: 1,show:4,highest:this.highestPrice,lowest:this.lowestPrice}})
  }else{
    this.articlesInStores=this.articlesInStores.slice((this.currentGroup-1)*this.articleByPage,this.currentGroup*this.articleByPage)
  }
  this.articlesToOrderBackup=[]
  this.articlesInStores.forEach((a)=>{this.articlesToOrderBackup.push(a)})
}

  username:any=this.storage.getUser()?.username
  addPanierLigne(article:ArticleInStore){
     let ligne=new LignePanier(article.articleID,1,this.username)
     this.subscription4=this.backend.addLignePanier(ligne).subscribe((data)=>{
          console.log(data.status)
          if(data.body!=null){
          console.log(data)
          
        }},(error)=>{
          console.log(error.status)
        console.log(error.error)
       
        },()=>{
          console.log("no problem")
        //this.getAllCommandLignes()
        this.getAllPanierLignes()
        this.panierCommunicator.emitEvent()
      })
      
  }
   lignesPanier:LignePanierDto[]=[]
  getAllPanierLignes(){
    
    this.subscription5=this.backend.getAllPanierLignes(this.username).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.lignesPanier=data.body
      console.log(this.lignesPanier)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
this.matDialog.open(CartModalComponent,{width:"60%",data:this.lignesPanier})

})
  
  }
  /*getAllCommandLignes(){
    
    this.backend.getAllCommandLignesByUser(this.username).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.commandLignes=data.body
      console.log(this.commandLignes)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
  this.matDialog.open(CartModalComponent,{width:"80%",data:this.commandLignes})})
  }
  data:any
  username:any=this.storage.getUser()?.username
  /*addCommandLigne(article:ArticleInStore){
    let totalTaxe=article.articlePrixHT*article.taxe.taxeTaux/100
  let prixTTc=article.articlePrixHT+totalTaxe
      let ligne=new CommandLigne(0,article.articleID,"",article.tarifPrix,0,0,1,0
        ,0,0,this.username)
        this.backend.addLigneCommand(ligne).subscribe((data)=>{
          console.log(data.status)
          if(data.body!=null){
          this.data=data.body
          console.log(this.data)
          
        }},(error)=>{
          console.log(error.status)
        console.log(error.error)
       
        },()=>{
          console.log("no problem")
        this.getAllCommandLignes()})

  }*/
  //commandLignes:CommandLigne[]=[]
  /*getAllCommandLignes(){
    
    this.backend.getAllCommandLignesByUser(this.username).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.commandLignes=data.body
      console.log(this.commandLignes)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
  this.matDialog.open(CartModalComponent,{width:"80%",data:this.commandLignes})})
  }
*/ 
  addAndOpenCart(article:ArticleInStore){
//this.addCommandLigne(article)
this.addPanierLigne(article)
  }
  //articles:Article[]=[]
  /*getArticles(){
    this.backend.getArticlesForUser(Number(this.idCategoryLvl2)).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.articles=data.body
      console.log(this.articles)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      console.log("no problem")})
  }*/

  getCategoryLevel1(){
    this.subscription6=this.backend.getCategorieLevel1(this.nameCategoryLvl1).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.catalogue1=data.body
      console.log("racine catalogue")
      console.log(this.catalogue1)
      
      if(this.catalogue1.value.find((val)=>val.name==this.nameCategoryLvl2)==null){
        this.toaster.error("aucun catalogue contenaire des catalogues avec ce nom")
        this.router.navigate(["/notFound"])
      }
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    if(error.status==404){
      this.toaster.error("aucun catalogue racine avec ce nom")
      this.router.navigate(["/notFound"])
    }
    },()=>{console.log("no problem")
    this.ready=true
    console.log("finished fetching")}
    )
  }
/*
getCategoryLevel2(){
  this.backend.getCategorieLevel2(this.idCategoryLvl2).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.catalogue2=data.body
    console.log(this.catalogue2)
    this.catalogue3=this.catalogue2.value.find(c=>c.name==this.nameCategoryLvl3)
    if(this.catalogue3){
      for(let cat of this.catalogue2.value){
        this.checkbox.set(cat.name,false)
              }
this.checkbox.set(this.catalogue3.name,true)
    }else{
      for(let cat of this.catalogue2.value){
this.checkbox.set(cat.name,true)
      }
    }
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
  this.ready=true
  console.log("finished fetching")}
  )
}*/
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
  if(this.subscription6){
    this.subscription6.unsubscribe()
  }

}
}
