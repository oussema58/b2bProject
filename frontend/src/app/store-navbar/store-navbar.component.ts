import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { ArticleInStore } from '../models/ArticleInStore';
import { DashboardDto } from '../models/dashboardDto';
import { UserDto } from '../models/userDto';
import { Subscription } from 'rxjs';
import { ComponentCommunicator } from '../services/componentCommunicator.service';

@Component({
  selector: 'app-store-navbar',
  templateUrl: './store-navbar.component.html',
  styleUrls: ['./store-navbar.component.css']
})
export class StoreNavbarComponent implements OnDestroy {
  constructor(private storage:StorageService,private router:Router,private backend:BackendService,private renderer:Renderer2,
    private panierCommunicator:ComponentCommunicator
  ){

  }
 subscription1!:Subscription
 subscription2!:Subscription
 subscription3!:Subscription
 subscription4!:Subscription
 subscription5!:Subscription
  val=""
  ready=false
  name:any
  role:any

  defaultImage="assets/images/avatar/account.png"
  ngOnInit(): void {
    this.getCategoriesDivided()
    this.getDashboard()
    this.subscription4=this.panierCommunicator.updatePanierEvent.subscribe(()=>{
      console.log("updating the navbar nb panier")
      this.getDashboard()})
    this.subscription5=this.panierCommunicator.updateNavbarEvent.subscribe(()=>{
        console.log("updating the navbar nb panier")
        this.getUser()})
    this.getUser()
    this.role=this.storage.getUser()?.role
    console.log(this.role)
  }
  user!:UserDto
  getUser(){
   this.subscription1=this.backend.getUser().subscribe((data)=>{
      console.log(data)
if(data.body!=null){
console.log(data)
console.log(data.body)

this.user=data.body
console.log("user is in"+this.user)
}})
  }
  dashboard!:DashboardDto
  getDashboard(){
   this.subscription2=this.backend.getDashboardInfo().subscribe((data)=>{
      console.log(data.body)
      if(data.body!=null){
        this.dashboard=data.body
      }
    },(error)=>{

    },()=>{
      this.ready=true
    })
  }
  categoriesDivided:CatalogueKeyPair[]=[]
  deconnecter(){
    this.storage.removeUser()
    this.router.navigate(['login'])
  }
  catChosen:CatalogueKeyPair=new CatalogueKeyPair(0,[],"nothing")
  hasChosen=false
  openModel(cat:CatalogueKeyPair){
    this.hasChosen=true
this.catChosen=cat
console.log(this.catChosen)
  }
  getCategoriesDivided(){
this.subscription3=this.backend.getAllCategoriesDividedForUser().subscribe((data)=>{console.log(data);
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
articles:ArticleInStore[]=[]
/*getArticlesInStore(){
  this.backend.getArticlesInStore().subscribe((data)=>{console.log(data);
  console.log("status")
  console.log(data.status)
  if(data.body!=null){
    this.articles=data.body
    console.log(this.articles)
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
openCart(elem:HTMLDivElement){
this.renderer.addClass(elem,"cart-opened")
console.log("class added")
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
}
