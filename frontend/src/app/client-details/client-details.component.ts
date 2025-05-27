import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../models/client';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UpdateClientComponent } from '../update-client/update-client.component';
import { DeleteClientComponent } from '../delete-client/delete-client.component';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { Commande } from '../models/Commande';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit,OnDestroy {
constructor(private backend:BackendService,private activated:ActivatedRoute,
  private storageService:StorageService,private matDialog:MatDialog,private router:Router){

}
currentYear:any
select1:any
select2:any
select3:any
data:any
role:any
idClient:any
subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
ngOnInit(): void {
  this.currentYear=2024
  this.select1=2024
  this.select2=2024
  this.select3=2024
 this.role=this.storageService.getUser()?.role
 console.log(this.role)
  this.activated.paramMap.subscribe((params)=>{
this.idClient=params.get("clientId")
console.log(this.idClient)
this.getClient()
this.getCommandes()
  })


    }

  getClient(){
   this.subscription1=this.backend.getClient(this.idClient).subscribe((data)=>{
      console.log(data)
if(data.body!=null){
this.data=data
this.client=data.body

}
    },(error)=>{
      if(error.status==404){
        this.router.navigate(["/notFound"])
      }
    })
  }
client!:Client
commandes:Commande[]=[]
getCommandes(){
  this.subscription3=this.backend.getAllCommandes().subscribe((data)=>{
    if(data.body!=null){
      console.log(this.commandes)
      this.commandes=data.body
    }
      console.log(data)},
    (error)=>{
      console.log(this.commandes)
      
    },()=>{
      this.rendernbCommandChart()
      this.renderEarningChart()
      this.renderProfitChart()
    })
}

openUpdate(client:Client){
  let matRef=this.matDialog.open(UpdateClientComponent,{
    width:"80%",data:client
  }
  )
  matRef.afterClosed().subscribe((res)=>{
    console.log("inside observable of after closed")
    console.log(res)
    if(res){
  this.getClient()
  }
  })
    }
    delete(id:number){
      this.subscription2=this.backend.deleteClient(id).subscribe((data)=>{
  console.log(data)
      },(error)=>{
        console.log(error)
        console.log(error.error)
       
      },()=>{console.log("everything went fine")
    this.router.navigate(["/dashboard/client/group/"+1])
    })
      
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

    }
    totalEarning=0
    totalProfit=0
    totalSocieteEarning=0
    totalSocieteProfit=0
    earningsChart:any
    profitChart:any
    renderEarningChart(){
      let labelX:string[]=[]
      let salesList=[]
      /*let profitList=[]*/
      let salesSocieteList=[]
      /*let profitSocieteList=[]*/
      let sales=0
      /*let profit=0*/
      let salesSociete=0
      /*let profitSociete=0*/
      this.totalEarning=0
      /*this.totalProfit=0*/
      this.totalSocieteEarning=0
      /*this.totalSocieteProfit=0*/
    if(this.earningsChart){
      this.earningsChart.destroy()
    }
    if(this.earningPercentege){
      this.earningPercentege.destroy()
    }
    console.log(this.select1)
      if(this.select2=="last"){
    for(let i=this.nbYears;i>=0;i--){
    labelX.push(String(this.currentYear-i))
    }
    let j=this.nbYears
    while(j>=0){
      sales=0
      /*profit=0*/
      salesSociete=0
      /*profitSociete=0*/
      for(let commande of this.commandes){
        if(new Date(commande.dateCreate).getFullYear()==(this.currentYear-j )){
          if(commande.clientId==this.idClient){
            salesSociete=salesSociete+commande.commandeTotalTtc
        /*profitSociete=profitSociete+commande.commandeRevenue*/
          }
        sales=sales+commande.commandeTotalTtc
        /*profit=profit+commande.commandeRevenue*/
        }
          }
          salesList.push(sales)
          salesSocieteList.push(salesSociete)
          this.totalEarning=this.totalEarning+sales
          this.totalSocieteEarning=this.totalSocieteEarning+salesSociete

          //this.totalProfit=this.totalProfit+profit
          // this.totalSocieteProfit=this.totalSocieteProfit+profitSociete
          // profitList.push(profit)
          // profitSocieteList.push(profitSociete)
          j--
    }
      }else{
        labelX=['Jan', 'Fev', 'Mar','Aprl',
        'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec']
      let month=1
    
      while(month<13){
        sales=0
        // profit=0
        // profitSociete=0
        salesSociete=0
      for(let commande of this.commandes){
    if(new Date(commande.dateCreate).getMonth()+1==month && new Date(commande.dateCreate).getFullYear()==Number(this.select2)){
      if(commande.clientId==this.idClient){
        salesSociete=salesSociete+commande.commandeTotalTtc
    // profitSociete=profitSociete+commande.commandeRevenue
      }
    sales=sales+commande.commandeTotalTtc
    // profit=profit+commande.commandeRevenue
    }
      }

     salesList.push(sales)
     salesSocieteList.push(salesSociete)
     this.totalEarning=this.totalEarning+sales
     this.totalSocieteEarning=this.totalSocieteEarning+salesSociete
    //  this.totalProfit=this.totalProfit+profit
    //  this.totalSocieteProfit=this.totalSocieteProfit+profitSociete
    //  profitList.push(profit)
    //  profitSocieteList.push(profitSociete)
      month=month+1
    }
      }
      console.log(this.select2)
      console.log(labelX)
      // console.log(profitList)
      console.log(salesList)
      let datasets:{label:string,data:any,backgroundColor:string}[]=[]
      if(this.role=='ADMIN'){
        datasets.push({label:"vente des autres société",data:salesList,backgroundColor:"red"},
        {label:"vente du société",data:salesSocieteList,backgroundColor:"blue"}
        )
      }else{
        datasets.push(
        {label:"vente du société",data:salesSocieteList,backgroundColor:"blue"})
      }
      /*
       datasets: [
            {
              label: "vente des autres société",
              data: salesList,
              backgroundColor: 'red'
            },
            {
              label: "vente du société",
              data: salesSocieteList,
              backgroundColor: 'blue'
            }  
      */ 
      this.earningsChart = new Chart("earningsChart", {
        type: 'bar', //this denotes tha type of chart
    
        data: {// values on X-Axis
          labels: labelX, 
           datasets: datasets
        },
        options: {
          aspectRatio:2.5
        }
        
      });
      let percentageSociete=0
      let percentageAutresSociete=0
      if(this.totalEarning!=0){
      percentageSociete=(this.totalSocieteEarning/(this.totalEarning))*100
      percentageAutresSociete=((this.totalEarning-this.totalSocieteEarning)/(this.totalEarning))*100
    }
    console.log("before showing eraning graph total: "+this.totalEarning+" specific: "+this.totalSocieteEarning)
      let coloresToUse=['red', 'blue']
      this.earningPercentege= new Chart("earningPercentege", {
        type: 'doughnut', //this denotes tha type of chart
    
        data: {// values on X-Axis
          labels: ["autres societe commande "+percentageAutresSociete.toFixed(2)+" %","commande société "+percentageSociete.toFixed(2)+" %"],
           datasets: [{
      label: 'repartitions des commandes',
      data: [(this.totalEarning-this.totalSocieteEarning),this.totalSocieteEarning],
     backgroundColor:coloresToUse,
      hoverOffset: 4
    }],
        },
        options: {
          aspectRatio:2.5
        }
    
      });
      
    }
    profitChartPercentage:any
    earningPercentege:any
    renderProfitChart(){
      let labelX:string[]=[]
      let profitList=[]
      let profitSocieteList=[]

      let profit=0
      let profitSociete=0
      this.totalProfit=0
      this.totalSocieteProfit=0
    if(this.profitChart){
      this.profitChart.destroy()
    }
    if(this.profitChartPercentage){
      this.profitChartPercentage.destroy()
    }
    console.log(this.select1)
      if(this.select3=="last"){
    for(let i=this.nbYears;i>=0;i--){
    labelX.push(String(this.currentYear-i))
    }
    let j=this.nbYears
    while(j>=0){
      profit=0
      profitSociete=0
      for(let commande of this.commandes){
        if(new Date(commande.dateCreate).getFullYear()==(this.currentYear-j )){
          if(commande.clientId==this.idClient){
        profitSociete=profitSociete+commande.commandeRevenue
          }
        profit=profit+commande.commandeRevenue
        }
          }
        
          
          this.totalProfit=this.totalProfit+profit
          this.totalSocieteProfit=this.totalSocieteProfit+profitSociete
          profitList.push(profit)
          profitSocieteList.push(profitSociete)
          j--
    }
      }else{
        labelX=['Jan', 'Fev', 'Mar','Aprl',
        'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec']
      let month=1
    
      while(month<13){
        profit=0
        profitSociete=0
      for(let commande of this.commandes){
    if(new Date(commande.dateCreate).getMonth()+1==month && new Date(commande.dateCreate).getFullYear()==Number(this.select3)){
      if(commande.clientId==this.idClient){
    profitSociete=profitSociete+commande.commandeRevenue
      }
    profit=profit+commande.commandeRevenue
    }
      }
     this.totalProfit=this.totalProfit+profit
     this.totalSocieteProfit=this.totalSocieteProfit+profitSociete
     profitList.push(profit)
     profitSocieteList.push(profitSociete)
      month=month+1
    }
      }
      console.log(this.select2)
      console.log(labelX)
      console.log(profitList)
      this.profitChart = new Chart("profitChart", {
        type: 'bar', //this denotes tha type of chart
    
        data: {// values on X-Axis
          labels: labelX, 
           datasets: [
            {
              label: "revenues totales des societes",
              data: profitList,
              backgroundColor: 'red'
            },
            {
              label: "revenues des sociétes",
              data: profitSocieteList,
              backgroundColor: 'blue'
            }  
          ]
        },
        options: {
          aspectRatio:2.5
        }
        
      });
      let percentageSociete=0
      let percentageAutresSociete=0
      if(this.totalProfit!=0){
      percentageSociete=(this.totalSocieteProfit/(this.totalProfit))*100
      percentageAutresSociete=((this.totalProfit-this.totalSocieteProfit)/(this.totalProfit))*100
    }
      let coloresToUse=['red', 'blue']
      this.profitChartPercentage= new Chart("profitChartPercentage", {
        type: 'doughnut', //this denotes tha type of chart
    
        data: {// values on X-Axis
          labels: ["autres societe commande "+percentageAutresSociete.toFixed(2)+" %","commande société "+percentageSociete.toFixed(2)+" %"],
           datasets: [{
      label: 'repartitions des commandes',
      data: [this.totalProfit-this.totalSocieteProfit,this.totalSocieteProfit],
     backgroundColor:coloresToUse,
      hoverOffset: 4
    }],
        },
        options: {
          aspectRatio:2.5
        }
    
      });
      
    }
    

    nbCommande=0
    nbCommandChart:any
    nbCommandChartPercentage:any
    nbYears=5
    nbCommandeSociete=0
    rendernbCommandChart(){
      let labelX:string[]=[]
      let nbCommandeList:number[]=[]
      let nbCommandeSocieteList:number[]=[]
      let nbCommande=0
      this.nbCommande=0
      this.nbCommandeSociete=0
      let nbCommandeSociete=0
      if (this.nbCommandChart) {
        this.nbCommandChart.destroy();
      }
      if(this.nbCommandChartPercentage){
        this.nbCommandChartPercentage.destroy()
      }
      console.log(this.select1)
      if(this.select1=="last"){
    for(let i=this.nbYears;i>=0;i--){
    labelX.push(String(this.currentYear-i))
    }
    
    let j=this.nbYears
    while(j>=0){
      nbCommande=0
      nbCommandeSociete=0
      for(let commande of this.commandes){
        if(new Date(commande.dateCreate).getFullYear()==(this.currentYear-j )){
          if(commande.clientId==this.idClient){
            nbCommandeSociete=nbCommandeSociete+1
          }
        nbCommande=nbCommande+1
        }
          }
      nbCommandeList.push(nbCommande)
      nbCommandeSocieteList.push(nbCommandeSociete)
      this.nbCommande=this.nbCommande+nbCommande
      this.nbCommandeSociete=this.nbCommandeSociete+nbCommandeSociete
      j--
    }
      }else{
      labelX=['Jan', 'Fev', 'Mar','Aprl',
      'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec']
      let month=1
      //let nbCommande=0
      while(month<13){
        nbCommande=0
        nbCommandeSociete=0
      for(let commande of this.commandes){
    if(new Date(commande.dateCreate).getMonth()+1==month && new Date(commande.dateCreate).getFullYear()==Number(this.select1) ){
      if(commande.clientId==this.idClient){
        nbCommandeSociete=nbCommandeSociete+1
      }
    nbCommande=nbCommande+1
    }
      }
    nbCommandeList.push(nbCommande)
    nbCommandeSocieteList.push(nbCommandeSociete)
    this.nbCommande=this.nbCommande+nbCommande
    this.nbCommandeSociete=this.nbCommandeSociete+nbCommandeSociete
      month=month+1
    }
      }
      console.log(labelX)
      console.log(nbCommandeList)
      console.log(nbCommandeSocieteList)
      this.nbCommandChart = new Chart("nbCommandChart", {
        type: 'line', //this denotes tha type of chart
    
        data: {// values on X-Axis
          labels: labelX, 
           datasets: [
            {
              label: "nombre des commandes totales "+"("+(this.nbCommande)+")",
              data: nbCommandeList,
              backgroundColor: 'red',borderColor:'red'
            },
            {
              label: "nombre commandes societe "+"("+this.nbCommandeSociete+")",
              data: nbCommandeSocieteList,
              backgroundColor: 'blue',borderColor:"blue"
            }
          ]
        },
        options: {
          aspectRatio:2.5
        }
        
      });
      let percentageSociete=0
      let percentageAutresSociete=0
      if(this.nbCommande!=0){
      percentageSociete=(this.nbCommandeSociete/(this.nbCommande))*100
      percentageAutresSociete=((this.nbCommande-this.nbCommandeSociete)/(this.nbCommande))*100
    }
      let coloresToUse=['red', 'blue']
      console.log("before displaying percentage chart totale: "+this.nbCommande+" specific: "+this.nbCommandeSociete)
      this.nbCommandChartPercentage= new Chart("nbCommandePercentage", {
        type: 'doughnut', //this denotes tha type of chart
    
        data: {// values on X-Axis
          labels: ["autres societe commande "+percentageAutresSociete.toFixed(2)+" %","commande société "+percentageSociete.toFixed(2)+" %"],
           datasets: [{
      label: 'repartitions des commandes',
      data: [(this.nbCommande-this.nbCommandeSociete),this.nbCommandeSociete],
     backgroundColor:coloresToUse,
      hoverOffset: 4
    }],
        },
        options: {
          aspectRatio:2.5
        }
    
      });
    }
    }

