import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TarifEnt } from '../models/tarifEnt';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tarif-managment',
  templateUrl: './tarif-managment.component.html',
  styleUrls: ['./tarif-managment.component.css']
})
export class TarifManagmentComponent implements OnInit,OnDestroy{
  constructor(private backend:BackendService,private toaster:ToastrService,private matDialog:MatDialog,private formBuilder:FormBuilder,
    private renderer:Renderer2){

  }

  subscription1!:Subscription
  subscription2!:Subscription
  intituleTarif=""
  ready=false
  safeZone=30
  dangerZone=10
  daysLeft(date:any){
    let currentDate=new Date()
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)
    /*console.log(currentDate)
    console.log(new Date(Date.parse(date)))
    console.log(currentDate.getTime)
    console.log(new Date(Date.parse(date)).getTime())*/
   
    const timeDifference = new Date(Date.parse(date)).getTime() -currentDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  //console.log(timeDifference)
  //console.log(daysDifference)
  return daysDifference
  }
  tarifs:TarifEnt[]=[]
  tarifsBackup:TarifEnt[]=[]
  dataSource!:MatTableDataSource<TarifEnt>
  @ViewChild(MatPaginator) paginator !: MatPaginator
  displayedColumns=["Code","Intitule","date fin","jour Restants","Action"]
  ngOnInit(): void {
      this.getTarifs()
  }
  getTarifs(){
   this.subscription1=this.backend.getAllTarif().subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.tarifs=data.body
      this.tarifs=this.tarifs.reverse()
      console.log(this.tarifs)
      this.dataSource=new MatTableDataSource<TarifEnt>(this.tarifs)
      this.dataSource.paginator=this.paginator
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
  this.ready=true
  this.tarifsBackup=this.tarifs
})
  }
  change(){
    if(this.intituleTarif==""){
      this.tarifs=this.tarifsBackup
    }else{
      this.tarifs=[]
      for(let tarif of this.tarifsBackup){
    
        if(tarif.tarif_Entete_intitule.toLocaleLowerCase().startsWith(this.intituleTarif.toLocaleLowerCase()) ||
         tarif.tarif_Entete_intitule.split(" ").find((i)=>i.toLocaleLowerCase().startsWith(this.intituleTarif.toLocaleLowerCase()))){
          this.tarifs.push(tarif)
        }
      }
    }
    this.dataSource.data=this.tarifs
  }
  delete(id:number){
    this.subscription2=this.backend.deleteTarifEnt(id).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.tarifs=data.body
      console.log(this.tarifs)
      this.toaster.success(data.body.message,"Terminé avec succées")
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    this.toaster.error(error.error,"Terminé avec echec")
    },()=>{console.log("no problem")
  this.ready=true
this.getTarifs()
this.intituleTarif=""
})
  }
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
    if(this.subscription2){
      this.subscription2.unsubscribe()
    }
 
  }
  }
