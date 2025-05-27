import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../models/article';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ArticleUpdateComponent } from '../article-update/article-update.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService,private activated:ActivatedRoute,private router:Router,
    private matDialog:MatDialog,private toaster:ToastrService
  ){

  }

  data:any
  idArticle:any
  subscription1!:Subscription
  subscription2!:Subscription
  ngOnInit(): void {
    this.activated.paramMap.subscribe((params)=>{
  this.idArticle=params.get("articleId")
  console.log(this.idArticle)
  this.getArticle(this.idArticle)
    })
      }
    getArticle(id:number){
     this.subscription1=this.backend.getArticle(id).subscribe((data)=>{
        console.log(data)
  if(data.body!=null){
  this.article=data.body
  }
      },(error)=>{
        if(error.status==404){
          this.router.navigate(["/notFound"])
        }
      })
    }
article!:Article

ngOnDestroy(): void {
  if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  if(this.subscription2){
    this.subscription2.unsubscribe()
  }
}
  openEdit(article:Article){
    let ref=this.matDialog.open(ArticleUpdateComponent,{width:"80%",data:article})
ref.afterClosed().subscribe((data)=>{
  
if(data){
  this.getArticle(this.idArticle)
}
})
  }
  delete(id:number){
    this.subscription2=this.backend.deleteArtilce(id).subscribe({next:(data)=>{
       console.log("article is deleting ...")
       this.toaster.success("Terminé avec succées",data.body.message,{disableTimeOut:true})
     },error:(error)=>{console.log(error)
       console.log(error.error)
       this.toaster.error("Terminé avec echec",error.error)},
     complete:()=>{
       this.router.navigate(["dashboard/article"])
     }})
   }
}

