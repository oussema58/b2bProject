import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { StorageService } from '../services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { LigneWishlistDto } from '../models/LigneWishlistDto';
import { LignePanier } from '../models/LignePanier';
import { LignePanierDto } from '../models/LignePanierDto';
import { MatDialog } from '@angular/material/dialog';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  
})
export class WishlistComponent implements OnInit,OnDestroy{
  constructor(private backend:BackendService,private storage:StorageService,private toaster:ToastrService,private matDialog:MatDialog){

  }
 
  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  data:any
  isEmpty=false
  lignes:LigneWishlistDto[]=[]
  dataSource!:MatTableDataSource<LigneWishlistDto>
  displayedColumns:string[]=["Produit","Intitule","Prix_HT","Prix_TTC","Actions"]
@ViewChild(MatPaginator) paginator !: MatPaginator
    getAllLigneWishlist(){
      this.subscription1=this.backend.getAllLignesWishlist().subscribe((data)=>{
        console.log(data.status)
        if(data.body!=null){
        this.lignes=data.body
        console.log(this.lignes)
        if(this.lignes.length==0){
          
          this.isEmpty=true
        }
        this.dataSource=new MatTableDataSource<LigneWishlistDto>(this.lignes)
        this.dataSource.paginator=this.paginator
      }},(error)=>{
        console.log(error.status)
      console.log(error.error)
      },()=>{console.log("no problem")
    })
  }
  deleteLigneWishlist(id:number){
    this.subscription2=this.backend.deleteLigneWishlistById(id).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
        console.log(data.body)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
   this.getAllLigneWishlist()
  })
  }  
  addPanierLigne(ligne:LigneWishlistDto){
    let ligne2=new LignePanier(ligne.articleId,1,this.username)
     this.subscription3=this.backend.addLignePanier(ligne2).subscribe((data)=>{
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
    username:any
    idClient:any
    ngOnInit(): void {
      this.username=this.storage.getUser()?.username
      this.idClient=this.storage.getUser()?.idClient
      this.getAllLigneWishlist()
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
