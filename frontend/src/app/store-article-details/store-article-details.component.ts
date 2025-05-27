import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { ArticleInStore } from '../models/ArticleInStore';
import { Article } from '../models/article';
import { LignePanier } from '../models/LignePanier';
import { LignePanierDto } from '../models/LignePanierDto';
import { MatDialog } from '@angular/material/dialog';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { LigneWishlist } from '../models/LigneWishlist';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ComponentCommunicator } from '../services/componentCommunicator.service';

@Component({
  selector: 'app-store-article-details',
  templateUrl: './store-article-details.component.html',
  styleUrls: ['./store-article-details.component.css']
})
export class StoreArticleDetailsComponent implements OnInit,OnDestroy {
  constructor(private storage:StorageService,private router:Router,private backend:BackendService,private activated:ActivatedRoute,
    private matDialog:MatDialog,private toaster:ToastrService,private panierCommunicator:ComponentCommunicator){

  }

subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
subscription4!:Subscription
subscription5!:Subscription
subscription6!:Subscription
subscription7!:Subscription
subscription8!:Subscription
subscription9!:Subscription
subscription10!:Subscription
  navigateBackward(){
    let container=document.getElementById("gallery")
    if(container!=null){
      container.style.scrollBehavior="smooth"
      container.scrollLeft-=container.offsetWidth*0.33
    //container.scrollLeft-=300
   
  }
  }
  navigateForward(){
    let container=document.getElementById("gallery")
    
    if(container!=null){
      container.style.scrollBehavior="smooth"
      container.scrollLeft+=container.offsetWidth*0.33
    //container.scrollLeft+=300
  }
  }

  ready=false
  articleId=0
  ngOnInit(): void {
this.activated.paramMap.subscribe((params)=>{
  this.articleId=Number(params.get("articleId"))

  let id:any=params.get("articleId")
  console.log("id article is "+id)
  console.log("increment view")
  this.IncrementView(id)
  this.quantite=1

  this.getArticle()
})
    //this.getFeaturedArticlesInStore()
    this.getBestSellingArticlesInStore()
    this.getRecentArticlesInStore()
    this.getBestConsultedArticlesInStore()

  }
  IncrementView(idArticle:string){
    let form=new FormData()
    console.log("inide increment view")
    form.append("idArticle2",idArticle)
    this.subscription10=this.backend.incrementView(form).subscribe((data)=>{console.log(data);
      console.log("status")
      console.log(data.status)
      if(data.body!=null){
        
        console.log("good")
          }
        }
          ,
          (error)=>{console.log("a problem when fetching the user from database ")
                    console.log(error.status)
                    console.log(error.error) 
                    if(error.status==404){
                      this.router.navigate(["/notFound"])
                    }
        },()=>{
          
        }
          
          )
  }
  navigateUsingCategory(art:ArticleInStore | Article){
    let category3=""
    if(art instanceof ArticleInStore){
      category3=art.catalogueIntitule
    }

    if(art instanceof Article){
      category3=art.catalogue.catalogueIntitule
    }
    this.subscription1=this.backend.findCategoryLevel3Parent(category3).subscribe((data)=>{
      if(data.body!=null){
        this.router.navigate(["/store/article/category/"+data.body.category1+"/"+data.body.category2+"/"+category3])
      }
    },(error)=>{
      console.log("erreur au cours du navigation")
    })
   
  }


  username:any=this.storage.getUser()?.username
  addToWishlist(art:ArticleInStore){
   this.subscription2=this.backend.addLigneWishlist(new LigneWishlist(art.articleID)).subscribe((data)=>{
    if(data.body!=null){
      console.log(data.body)
    this.toaster.success(data.body.message)
    }
    },(error)=>{
      console.log(error)
      console.log(error.error)
      this.toaster.error(error.error)
    })
      }
  addPanierLigne(id:number,quantite:number){
    if(quantite==0){
      quantite=this.quantite
    }
      let ligne=new LignePanier(id,quantite,this.username)
      this.subscription3=this.backend.addLignePanier(ligne).subscribe((data)=>{
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
    
    this.subscription4=this.backend.getAllPanierLignes(this.username).subscribe((data)=>{
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

  updateQuantity(qte:number){
    this.quantite=qte
  }
  changeValue(input:any){
    console.log("blur event")
    console.log(this.quantite)
    if(!Number.isInteger(Number.parseInt(input.value)) || input.value<=0){
      input.value=this.quantite
    }else{
      this.quantite=input.value
    }
 
      }
  

 quantite=1
 
featuredArticles:ArticleInStore[]=[]
article!:ArticleInStore
getArticle(){
  this.subscription5=this.backend.getArticleInStoreById(this.articleId).subscribe((data)=>{console.log(data);
    console.log("status")
    console.log(data.status)
    if(data.body!=null){
      this.article=data.body
      console.log("the articles with id + "+this.articleId+" is ")
      console.log(this.article)
        }
      }
        ,
        (error)=>{console.log("a problem when fetching the user from database ")
                  console.log(error.status)
                  console.log(error.error) 
                  if(error.status==404){
                    this.router.navigate(["/notFound"])
                  }
      },()=>{
        this.getRelatedProduct()
      }
        
        )
    }
/*    
article!:Article
getArticle(){
  this.backend.getArticle(this.articleId).subscribe((data)=>{console.log(data);
    console.log("status")
    console.log(data.status)
    if(data.body!=null){
      this.article=data.body
      console.log("the articles with id + "+this.articleId+" is ")
      console.log(this.article)
        }
      }
        ,
        (error)=>{console.log("a problem when fetching the user from database ")
                  console.log(error.status)
                  console.log(error.error) 
      },()=>{
        this.getRelatedProduct()
      }
        
        )
    }*/
    relatedArticles:ArticleInStore[]=[]
  getRelatedProduct(){
    //this.backend.getArticlesInStoreByCategoryLvl3(this.article.catalogue.catalogueIntitule).subscribe((data)=>{
      this.subscription6=this.backend.getArticlesInStoreByCategoryLvl3(this.article.catalogueIntitule).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){

      this.relatedArticles=data.body
      /*this.articlesInStoresBackup=this.articlesInStores*/
      console.log("related articles")
      console.log(this.relatedArticles)
      this.relatedArticles=this.relatedArticles.filter((a)=>a.articleID!=this.articleId)
      
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
   
    },()=>{
      console.log("no problem")
  }
    )
  }
  bestConsultedArticles:ArticleInStore[]=[]
getBestConsultedArticlesInStore(){
  this.subscription7=this.backend.getBestConsultedArticles().subscribe((data)=>{console.log(data);
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
  /*
getFeaturedArticlesInStore(){
  this.subscription7=this.backend.getFeaturedArticlesInStore().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.featuredArticles=data.body
    this.featuredArticles=this.featuredArticles.filter((a)=>a.articleID!=this.articleId)
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
bestSellingArticles:ArticleInStore[]=[]
getBestSellingArticlesInStore(){
  this.subscription8=this.backend.getBestSellingArticlesInStore().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.bestSellingArticles=data.body
    this.bestSellingArticles=this.bestSellingArticles.filter((a)=>a.articleID!=this.articleId)
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
  this.subscription9=this.backend.getRecentArticlesInStore().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.recentArticles=data.body
    console.log("best selling articles are ")
    this.recentArticles=this.recentArticles.filter((a)=>a.articleID!=this.articleId)
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
    if(this.subscription7){
      this.subscription7.unsubscribe()
    }
    if(this.subscription8){
      this.subscription8.unsubscribe()
    }
    if(this.subscription9){
      this.subscription9.unsubscribe()
    }
    
  }
}

