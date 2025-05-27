import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Subscription } from 'rxjs';
import { subscript } from 'ngx-bootstrap-icons';
import { DashboardAdminDto } from '../models/dashboardAdminDto';
import { Commande } from '../models/Commande';
import { CommandeByCategory } from '../models/CommandeByCategory';
import { Catalogue } from '../models/catalogue';
import { Client } from '../models/client';
import { BestClient } from '../models/bestClient';
import { BestArticle } from '../models/bestArticles';
import { Chart,registerables } from 'node_modules/chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
Chart.register(...registerables)
@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit,OnDestroy {
  constructor(private backend:BackendService){
  }
  subscription1!:Subscription
  subscription2!:Subscription
  subscription3!:Subscription
  subscription4!:Subscription
  subscription5!:Subscription
  subscription6!:Subscription
  currentYear:any
  select1:any
  select2:any
  select3:any
  ngOnInit(): void {
    this.currentYear=2024
    this.select1=2024
    this.select2="all"
    this.select3=2024
   this.getDashboardAdminInfo()
   this.getCommandesByCatalogues()
   this.getCommandes()
   //this.getMeilleurArticles()
   this.getMeilleurClient()
  }
  changeYear1(){

  }
data!:DashboardAdminDto
chart:any

getDashboardAdminInfo(){
  this.subscription1=this.backend.getDashboardAdminInfo().subscribe((data)=>{
    if(data.body!=null){
      this.data=data.body
    }
      console.log(data)})
}

commandes:Commande[]=[]

allCommandes:Commande[]=[]
totalRevenue=0
totalVente=0
getCommandes(){
  this.subscription2=this.backend.getAllCommandes().subscribe((data)=>{
    if(data.body!=null){
      for(let com of data.body){
        this.allCommandes.push(com)
        if(com.statutId!=1 && com.statutId!=3){
          this.commandes.push(com)
        }
      }
      /*console.log(this.commandes)
      this.commandes=data.body*/
      
    }
      console.log(data)},
    (error)=>{
      console.log(this.commandes)
      
    },()=>{
      this.renderEarningChart()
      this.rendernbCommandChart()
    })
}

earningsChart:any
nbCommandChart:any
nbYears=5
nbCommande=0
rendernbCommandChart(){
  let labelX:string[]=[]
  let nbCommandeList:number[]=[]
  let nbCommande=0
  this.nbCommande=0
  if (this.nbCommandChart) {
    this.nbCommandChart.destroy();
  }
  console.log(this.select1)
  if(this.select1=="last"){
for(let i=this.nbYears;i>=0;i--){
labelX.push(String(this.currentYear-i))
}

let j=this.nbYears
while(j>=0){
  nbCommande=0
  for(let commande of this.allCommandes){
    if(new Date(commande.dateCreate).getFullYear()==(this.currentYear-j )){
    nbCommande=nbCommande+1
    }
      }
  nbCommandeList.push(nbCommande)
  this.nbCommande=this.nbCommande+nbCommande
  j--
}
  }else{
  labelX=['Jan', 'Fev', 'Mar','Aprl',
  'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec']
  let month=1
  let nbCommande=0
  while(month<13){
    nbCommande=0
  for(let commande of this.allCommandes){
if(new Date(commande.dateCreate).getMonth()+1==month && new Date(commande.dateCreate).getFullYear()==Number(this.select1) ){
nbCommande=nbCommande+1
}
  }
nbCommandeList.push(nbCommande)
this.nbCommande=this.nbCommande+nbCommande
  month=month+1
}
  }
  console.log(labelX)
  console.log(nbCommandeList)
  this.nbCommandChart = new Chart("nbCommandChart", {
    type: 'line', //this denotes tha type of chart

    data: {// values on X-Axis
      labels: labelX, 
       datasets: [
        {
          label: "nombre commandes",
          data: nbCommandeList,
          backgroundColor: 'blue'
        }
      ]
    },
    options: {
      aspectRatio:2.5
    }
    
  });

}
 
  totalEarning:any
  totalProfit:any
renderEarningChart(){
  let labelX:string[]=[]
  let salesList=[]
  let profitList=[]
  let sales=0
  let profit=0
  this.totalEarning=0
  this.totalProfit=0
if(this.earningsChart){
  this.earningsChart.destroy()
}
console.log(this.select1)
  if(this.select3=="last"){
for(let i=this.nbYears;i>=0;i--){
labelX.push(String(this.currentYear-i))
}
let j=this.nbYears
while(j>=0){
  sales=0
  profit=0
  for(let commande of this.commandes){
    if(new Date(commande.dateCreate).getFullYear()==(this.currentYear-j )){
    sales=sales+commande.commandeTotalTtc
    profit=profit+commande.commandeRevenue
    }
      }
      salesList.push(sales)
      this.totalEarning=this.totalEarning+sales
      this.totalProfit=this.totalProfit+profit
      profitList.push(profit)
      j--
}
  }else{
    labelX=['Jan', 'Fev', 'Mar','Aprl',
    'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec']
  let month=1

  while(month<13){
    sales=0
    profit=0
  for(let commande of this.commandes){
if(new Date(commande.dateCreate).getMonth()+1==month && new Date(commande.dateCreate).getFullYear()==Number(this.select3)){
  
sales=sales+commande.commandeTotalTtc
profit=profit+commande.commandeRevenue
}
  }
 salesList.push(sales)
 this.totalEarning=this.totalEarning+sales
 this.totalProfit=this.totalProfit+profit
 profitList.push(profit)
  month=month+1
}
  }
  console.log(this.select3)
  console.log(labelX)
  console.log(profitList)
  console.log(salesList)
  this.earningsChart = new Chart("earningsChart", {
    type: 'bar', //this denotes tha type of chart

    data: {// values on X-Axis
      labels: labelX, 
       datasets: [
        {
          label: "Sales",
          data: salesList,
          backgroundColor: 'blue'
        },
        {
          label: "Profit",
          data: profitList,
          backgroundColor: 'limegreen'
        }  
      ]
    },
    options: {
      aspectRatio:2.5
    }
    
  });
}
commandeByCategory:CommandeByCategory[]=[]
getCommandesByCatalogues(){
  this.subscription3=this.backend.getCommandesByCatalogues().subscribe((data)=>{
    if(data.body!=null){
      console.log("commandes by catalogues")
      console.log(data.body)
      this.commandeByCategory=data.body
    }
      console.log(data)},
    (error)=>{
      console.log(this.commandes)
      
    },()=>{
      this.renderSalesByCategoryChart()
      /*this.catalogueChosenForStat=this.commandeByCategory[0]
      this.catalogueSelected=this.catalogueChosenForStat.catalogue
      this.getCataloguesLevel3()*/
    })
}
totalSalesByCategory=0
renderSalesByCategoryChart(){
  if(this.chart){
    this.chart.destroy()
  }
  let cataloguesNames:string[]=[]
  let catalogueValues:number[]=[]
if(this.select2=="all"){
  this.totalSalesByCategory=0
  for(let cat of this.commandeByCategory){
cataloguesNames.push(cat.catalogue)
catalogueValues.push(cat.totalVente)
this.totalSalesByCategory=this.totalSalesByCategory+cat.totalVente
  }
}else{
  this.totalSalesByCategory=0
  for(let cat of this.commandeByCategory){
    let totalVente=0
    
    for(let ligne of cat.lignes){
      if(new Date(ligne.dateCreate).getFullYear()==Number(this.select2)){
totalVente=totalVente+ligne.ligneTotalTtc
      }
      
    }
    cataloguesNames.push(cat.catalogue)
      catalogueValues.push(totalVente)
      this.totalSalesByCategory=this.totalSalesByCategory+totalVente
   
}
}
  let coloresToUse=['red', 'green', 'blue', 'black','yellow', 'purple','yellow', 'orange', 'grey',  '#1e90ff']
    this.chart = new Chart("salesByCategory", {
      type: 'doughnut', //this denotes tha type of chart
  
      data: {// values on X-Axis
        labels: cataloguesNames,
         datasets: [{
    label: 'catalogues',
    data: catalogueValues,
   backgroundColor:coloresToUse,
    hoverOffset: 4
  }],
      },
      options: {
        aspectRatio:2.5
      }
  
    });
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
catalogueSelected:string=""
cataloguesOfSelect:Catalogue[]=[]
//catalogueChosenForStat!:CommandeByCategory
catalogueChosenForStat:any
getCataloguesLevel3(){
  this.subscription4=this.backend.getCategorieLevel3Active().subscribe((data)=>{
    if(data.body!=null){
      console.log(data.body)
      this.cataloguesOfSelect=data.body
    }
      console.log(data)},
    (error)=>{
      console.log(this.commandes)
      
    },()=>{
    })
}
bestClient:BestClient[]=[]
bestClientBackup:BestClient[]=[]
defaultImage="assets/images/avatar/societe.jpg"
table1Select="all"
clientDataSource!:MatTableDataSource<BestClient>
  @ViewChildren(MatPaginator) paginator!:QueryList<MatPaginator>
  // @ViewChildren("client") paginator1!:MatPaginator
  displayClientColumm=["image","Vente","Reveune"]
getMeilleurClient(){
  this.subscription5=this.backend.getMeilleurClients().subscribe((data)=>{
    if(data.body!=null){
    
      console.log("meilleur client")
      console.log(data.body)
      this.bestClient=data.body
      for(let a of this.bestClient){
        this.bestClientBackup.push(a)
      }
      this.clientDataSource=new MatTableDataSource<BestClient>(this.bestClient)
        this.clientDataSource.paginator=this.paginator.toArray()[0]
        // this.clientDataSource.paginator=this.paginator1
    }
      console.log(data)},
    (error)=>{
      console.log(this.commandes)
      
    },()=>{
      this.getMeilleurArticles()
    })
}
changeTable1(){
  console.log(this.table1Select)
  this.bestClient=[]
  if(this.table1Select=="all"){
    for(let best of this.bestClientBackup){
      this.bestClient.push(best)
    }
  }else{
    console.log("inside else")
    for(let best of this.bestClientBackup){
      let totalVente=0
      let totalRevenue=0
      for(let commande of best.commandes){
        if(new Date (commande.dateCreate).getFullYear()==Number(this.table1Select)){
          totalVente=totalVente+commande.commandeTotalTtc
          totalRevenue=totalRevenue+commande.commandeRevenue
        }
      }
      let copy1 = JSON.parse(JSON.stringify(best));
      let newBest = { ...copy1 };
      newBest.totalRevenue=totalRevenue
      newBest.totalVente=totalVente
      this.bestClient.push(newBest)
    }
    this.bestClient=this.bestClient.sort((a,b)=>b.totalRevenue-a.totalRevenue)
    this.clientDataSource.data=this.bestClient
  }
  console.log(this.bestClient)

}
bestArticles:BestArticle[]=[]
bestArticlesBackup:BestArticle[]=[]
table2Select="all"
dataSource!:MatTableDataSource<BestArticle>
// @ViewChildren("article") paginator2!:MatPaginator
displayedColumns=["image","Intitule","Prix","Quantite","Vente","Reveune"]
getMeilleurArticles(){
  this.subscription6=this.backend.getMeilleursArticles().subscribe((data)=>{
    if(data.body!=null){
      console.log(data.body)
      this.bestArticles=data.body
      for(let a of this.bestArticles){
        this.bestArticlesBackup.push(a)
      }
      this.dataSource=new MatTableDataSource<BestArticle>(this.bestArticles)
      this.dataSource.paginator=this.paginator.toArray()[1]
        // this.dataSource.paginator=this.paginator2
    }
      console.log(data)},
    (error)=>{
      console.log(this.commandes)
      
    },()=>{
    })
}
changeTable2(){
  console.log(this.table2Select)
  this.bestArticles=[]
  if(this.table2Select=="all"){
    for(let best of this.bestArticlesBackup){
      this.bestArticles.push(best)
    }
  }else{
    console.log("inside else")
    for(let best of this.bestArticlesBackup){
      let totalVente=0
      let totalRevenue=0
      for(let ligne of best.lignes){
        if(new Date (ligne.dateCreate).getFullYear()==Number(this.table2Select)){
          totalVente=totalVente+ligne.ligneTotalTtc
          totalRevenue=totalRevenue+ligne.ligneRevenue
        }
      }
      let copy1 = JSON.parse(JSON.stringify(best));
      let newBest = { ...copy1 };
      newBest.totalRevenue=totalRevenue
      newBest.totalVente=totalVente
      this.bestArticles.push(newBest)
     
    }
    this.bestArticles=this.bestArticles.sort((a,b)=>b.totalRevenue-a.totalRevenue)
  }
  this.dataSource.data=this.bestArticles
  console.log(this.bestArticles)

}

changeCatalogueSelected(){
  this.catalogueChosenForStat=this.commandeByCategory.find((a)=>a.catalogue==this.catalogueSelected)
}

}
