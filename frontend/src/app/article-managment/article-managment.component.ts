import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { PasswordFormatValidator } from '../validators/PasswordFormat.validator';
import { EmailFormatValidator } from '../validators/customEmail.validator';
import { Article } from '../models/article';
import { ArticleAddComponent } from '../article-add/article-add.component';
import { ArticleUpdateComponent } from '../article-update/article-update.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-managment',
  templateUrl: './article-managment.component.html',
  styleUrls: ['./article-managment.component.css']
})
export class ArticleManagmentComponent implements OnInit,OnDestroy {
  myForm!:FormGroup
  constructor(private renderer:Renderer2,private router:Router,
    private storage:StorageService,private formBuilder:FormBuilder,
    private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog){
  }
 
subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
subscription4!:Subscription
dialogResult=false
intituleArticle=""
  ngOnInit(): void {
    this.myForm=this.formBuilder.group({
      articleCode:["",[Validators.required]],
      articleIntitule:["",[Validators.required]],
      articlePrixHT:[0,[Validators.min(0)]],
      articleBarCode:["",[Validators.required]], 
      articleEtat:[true],
      articleStatistique:[true],

      taxeId:[0,[Validators.required]],
      catalogueId:["",[Validators.required]],
      familleId:["",[Validators.required]]
    })
    this.getArticles()
  }
  articles:Article[]=[]
articlesBackup:Article[]=[]
dataSource!:MatTableDataSource<Article>
@ViewChild(MatPaginator) paginator !: MatPaginator
displayedColumns=["image","Code","Intitule","Famille","Catalogue","Statistique","en vente","Prix","taux taxe","Action"]

  getArticles(){
   this.subscription1=this.backend.getArticles().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.articles=data.body.reverse()
      console.log(this.articles)
      // this.articles=[]
      this.dataSource=new MatTableDataSource<Article>(this.articles)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{
      console.log("no problem")
    this.articlesBackup=this.articles
    })
  }
  change(){
    if(this.intituleArticle==""){
      this.articles=this.articlesBackup
    }else{
      this.articles=[]
      for(let article of this.articlesBackup){
        article.catalogue.catalogueIntitule
        if(article.articleIntitule.toLocaleLowerCase().startsWith(this.intituleArticle.toLocaleLowerCase()) ||
         article.articleIntitule.split(" ").find((a)=>a.toLocaleLowerCase().startsWith(this.intituleArticle.toLocaleLowerCase()))){
          this.articles.push(article)
        }
      }
    }
    this.dataSource.data=this.articles
  }

  delete(id:number){
   this.subscription2=this.backend.deleteArtilce(id).subscribe({next:(data)=>{
      console.log("article is deleting ...")
      this.toaster.success(data.body.message,"Terminé avec succées",{disableTimeOut:true})
    },error:(error)=>{console.log(error)
      console.log(error.error)
      this.toaster.error(error.error,"Terminé avec echec")},
    complete:()=>{
      this.getArticles()
    }})
  }
  openEdit(article:Article){
    let ref=this.matDialog.open(ArticleUpdateComponent,{width:"80%",data:article})
ref.afterClosed().subscribe((data)=>{
  
if(data){
  this.getArticles()
  this.intituleArticle=""
}
})
  }
  openCreate(){
let ref=this.matDialog.open(ArticleAddComponent,{width:"80%"})
ref.afterClosed().subscribe((data)=>{
if(data){
  this.getArticles()
  this.intituleArticle=""
}
})
  }

  bloquer(id:number){
  this.subscription3=this.backend.blockArticle(id).subscribe({next:(data)=>{
      console.log("article is being blocked ...")
      console.log(data)
      this.toaster.success(data.message,"Terminé avec succées")
    },error:(error)=>{console.log(error)
      console.log(error.error)
      this.toaster.error(error.error,"Terminé avec echec")},
    complete:()=>{
      this.getArticles()
    }})
  }

  debloquer(id:number){
   this.subscription4=this.backend.unblockArticle(id).subscribe({next:(data)=>{
      console.log("article is getting unblocked...")
      this.toaster.success(data.message,"Terminé avec succées")
    },error:(error)=>{console.log(error)
      console.log(error.error)
      this.toaster.error(error.error,"Terminé avec echec")},
    complete:()=>{
      this.getArticles()
    }})
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

  }

