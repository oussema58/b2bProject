import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { ArticleInStore } from '../models/ArticleInStore';
import { LigneWishlist } from '../models/LigneWishlist';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store-main',
  templateUrl: './store-main.component.html',
  styleUrls: ['./store-main.component.css'],
  
})
export class StoreMainComponent implements OnInit,OnDestroy {
  constructor(private storage:StorageService,private router:Router,private backend:BackendService,private toaster:ToastrService){

  }

  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  subscription5!:Subscription
  subscription6!:Subscription
  navigateBackward(){
    let container=document.getElementById("gallery")
    if(container!=null){
      container.style.scrollBehavior="smooth"
    container.scrollLeft-=container.offsetWidth*0.33
    //container.scrollLeft-=295
  }
  }
  navigateForward(){
    let container=document.getElementById("gallery")
    
    if(container!=null){
      container.style.scrollBehavior="smooth"
      container.scrollLeft+=container.offsetWidth*0.33
    //container.scrollLeft+=295
  }
  }
  displayComments=false
  displayBanner=false
  addToWishlist(art:ArticleInStore){
this.subscription1=this.backend.addLigneWishlist(new LigneWishlist(art.articleID)).subscribe((data)=>{
if(data.body!=null){
  console.log(data.body)
this.toaster.success(data.body.message,"Terminé avec succées")
}
},(error)=>{
  console.log(error)
  console.log(error.error)
  this.toaster.error(error.error,"Terminé avec echec")
})
  }
  navigateUsingCategory(art:ArticleInStore){
    let category3=art.catalogueIntitule
    for(let cat1 of this.categoriesDivided){
      for(let cat2 of cat1.value){
        if(cat2.id==art.catalogueParentId){
          this.router.navigate(["/store/article/category/"+cat1.name+"/"+cat2.name+"/"+category3])
          return;
        }
      }
    }
  }

  ready=false
  ngOnInit(): void {
    this.getCategoriesDivided()
    //this.getFeaturedArticlesInStore()
    this.getBestConsultedArticlesInStore()
    this.getBestSellingArticlesInStore()
    this.getRecentArticlesInStore()

  }
  categoriesDivided:CatalogueKeyPair[]=[]
  catChosen:CatalogueKeyPair=new CatalogueKeyPair(0,[],"nothing")
  hasChosen=false
  openModel(cat:CatalogueKeyPair){
    this.hasChosen=true
this.catChosen=cat
console.log(this.catChosen)
  }
  getCategoriesDivided(){
this.subscription2=this.backend.getAllCategoriesDividedForUser().subscribe((data)=>{console.log(data);
console.log("status")
console.log(data.status)
if(data.body!=null){
  this.categoriesDivided=data.body
  console.log(this.categoriesDivided)
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
featuredArticles:ArticleInStore[]=[]
/*getFeaturedArticlesInStore(){
  this.subscription3=this.backend.getFeaturedArticlesInStore().subscribe((data)=>{console.log(data);
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
      ,()=>{this.ready=true}
      )
  }*/
  bestConsultedArticles:ArticleInStore[]=[]
getBestConsultedArticlesInStore(){
  this.subscription6=this.backend.getBestConsultedArticles().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.bestConsultedArticles=data.body
    console.log("best consulted articles are ")
    console.log(this.bestConsultedArticles)
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
  recentArticles:ArticleInStore[]=[]
getRecentArticlesInStore(){
 this.subscription5=this.backend.getRecentArticlesInStore().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.recentArticles=data.body
    console.log("recent  articles are ")
    console.log(this.recentArticles)
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
