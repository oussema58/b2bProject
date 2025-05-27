import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { Commande } from '../models/Commande';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommandLigne } from '../models/CommandLigne';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit,OnDestroy{
  constructor(private backend:BackendService,private activated:ActivatedRoute,
    private storageService:StorageService,private matDialog:MatDialog,private router:Router,private toaster:ToastrService){
  
  }

  subscription1!:Subscription
  orderId:any
  commande!:Commande
  role:any
clientId:any
  dataSource!:MatTableDataSource<CommandLigne>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns=["ligne num","Intitule","quantite","prix unitaire ttc","prix totale","totale taxe"]
  ngOnInit(): void {
    this.activated.paramMap.subscribe((params)=>{
  this.orderId=params.get("orderId")
  console.log(this.orderId)
  this.role=this.storageService.getUser()?.role
  this.clientId=this.storageService.getUser()?.idClient
  this.getCommandeById(this.orderId)
    })

      }
      getCommandeById(id:number){

       this.subscription1=this.backend.getCommandeById(id).subscribe((data)=>{
          console.log(data.status)
          if(data.body!=null){
          this.commande=data.body
          console.log(this.commande)
          if(this.role!="ADMIN"){
            if(this.commande.clientId!=this.clientId){
              
              this.router.navigate(["/notFound"])
            }
          }
          this.dataSource=new MatTableDataSource<CommandLigne>(this.commande.lignes)
        this.dataSource.paginator=this.paginator
        }},(error)=>{
          console.log(error.status)
        console.log(error.error)
        if(error.error=="aucun commande avec cette id"){
      this.router.navigate(["/notFound"])
    }
        },()=>{
          console.log("no problem")})
      }
      ngOnDestroy(): void {
        if(this.subscription1){
        this.subscription1.unsubscribe()
      }
      }
}
