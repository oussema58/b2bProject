import { Component, Renderer2 } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-aside-dashboard',
  templateUrl: './aside-dashboard.component.html',
  styleUrls: ['./aside-dashboard.component.css']
})
export class AsideDashboardComponent {
  constructor(private renderer:Renderer2,private backend:BackendService,private storage:StorageService){

  }

elements:{id:string,src:string,change:string,text:string,original:string,route:string}[]=[]
 elementsAdmin:{id:string,src:string,change:string,text:string,original:string,route:string}[]=[
    {id:"im2",src:"icon-user",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Gestion des Clients",route:"/client"},
    {id:"im3",src:"icon-grid",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Gestion des familles de produit",route:"/family"},
    {id:"im4",src:"icon-dollar-sign",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Gestion des impots",route:"/tax"},
    {id:"im5",src:"icon-layers",original:"bi bi-columns-gap-fill",change:"bi bi-columns-gap",text:"gestion des catalogues",route:"/category"},
    {id:"im6",src:"icon-box",original:"bi bi-archive-fill",change:"bi bi-archive",text:"Gestion des produits",route:"/article"},
    {id:"im7",src:"icon-file-plus",original:"bi bi-archive-fill",change:"bi bi-archive",text:"Gestion des tarifs",route:"/tarif"},
    {id:"im8",src:"icon-shopping-cart",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Gestion des commandes",route:"/order"},
    {id:"im9",src:"icon-send",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Gestion des Motifs",route:"/motif"},
    {id:"im10",src:"icon-arrow-left-circle",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Gestion des retours",route:"/demandeRetour"},
    
  ]
  /*
  elementsUser:{id:string,src:string,change:string,text:string,original:string,route:string}[]=[]
  */
  /*elements:{id:string,src:string,change:string,text:string,original:string,route:string,roles:string[]}[]=[
    {id:"im1",src:"bi bi-pie-chart-fill",original:"bi bi-pie-chart-fill",change:"bi bi-pie-chart",text:"Dashboard",route:"",roles:["ADMIN","CLIENT"]},
    {id:"im2",src:"bi bi-people-fill",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Manage Users",route:"/client",roles:["ADMIN","CLIENT"]},
    {id:"im3",src:"bi bi-people-fill",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Manage Product Family",route:"/family",roles:["ADMIN"]},
    {id:"im4",src:"bi bi-people-fill",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Manage taxes",route:"/tax",roles:["ADMIN"]},
    {id:"im5",src:"bi bi-columns-gap-fill",original:"bi bi-columns-gap-fill",change:"bi bi-columns-gap",text:"Manage Category",route:"/category",roles:["ADMIN"]},
    {id:"im6",src:"bi bi-archive-fill",original:"bi bi-archive-fill",change:"bi bi-archive",text:"Manage Product",route:"/article",roles:["ADMIN"]},
    {id:"im7",src:"bi bi-archive-fill",original:"bi bi-archive-fill",change:"bi bi-archive",text:"Manage Tarifs",route:"/tarif",roles:["ADMIN"]},
    {id:"im8",src:"bi bi-credit-card-2-back-fill",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Manage Order",route:"#",roles:["ADMIN","CLIENT"]},
    {id:"im9",src:"bi bi-receipt-fill",original:"bi bi-receipt-fill",change:"bi bi-receipt",text:"Manage Bill",route:"#",roles:["ADMIN","CLIENT"]}
  ]*/
  role:any
  idClient=-1
  ngOnInit(): void {
    console.log("i am aside")
    this.role=this.storage.getUser()?.role
    this.idClient=Number(this.storage.getUser()?.idClient)
    if(this.role=="ADMIN"){
     this.elements=this.elementsAdmin
    }else{
     this.elements=[
       //{id:"im1",src:"bi bi-pie-chart-fill",original:"bi bi-pie-chart-fill",change:"bi bi-pie-chart",text:"Dashboard",route:""},
       {id:"im2",src:"icon-user",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Manage Users",route:"/client/"+this.idClient+"/detail"},
       {id:"im3",src:"icon-shopping-cart",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Manage Order",route:"/order"},
       {id:"im10",src:"icon-arrow-left-circle",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Gestion demande de retour",route:"/demandeRetour"}
     ]
    }
   }
 /* ngOnInit(): void {
   console.log("i am aside")
   this.role=this.storage.getUser()?.role
   this.idClient=Number(this.storage.getUser()?.idClient)
   if(this.role=="ADMIN"){
    this.elements=this.elementsAdmin
   }
   if(this.role=="CLIENT"){
    this.elements=[
      //{id:"im1",src:"bi bi-pie-chart-fill",original:"bi bi-pie-chart-fill",change:"bi bi-pie-chart",text:"Dashboard",route:""},
      {id:"im2",src:"icon-user",original:"bi bi-pie-chart-fill",change:"bi bi-people",text:"Manage Users",route:"/client/"+this.idClient+"/detail"},
      {id:"im3",src:"icon-shopping-cart",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Manage Order",route:"/order"},
      {id:"im10",src:"icon-arrow-left-circle",original:"bi bi-credit-card-2-back-fill",change:"bi bi-credit-card-2-back",text:"Gestion demande de retour",route:"/demandeRetour"}
    ]
   }
  }*/
  changeIcon(elem:{change:string,src:string,original:string}){
elem.src=elem.change
  }
  originalIcon(elem:{id:string,src:string,original:string}){
elem.src=elem.original
  }
}
