import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { CommandLigne } from '../models/CommandLigne';
import { StorageService } from '../services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { CommandeDto } from '../models/CommandedDto';
import { LignePanier } from '../models/LignePanier';
import { LignePanierDto } from '../models/LignePanierDto';
import { Subscription } from 'rxjs';
import { ComponentCommunicator } from '../services/componentCommunicator.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation:ViewEncapsulation.ShadowDom
})
export class ChartComponent implements OnInit,OnDestroy {
constructor(private backend:BackendService,private storage:StorageService,private toaster:ToastrService,
  private panierCommunicator:ComponentCommunicator
){

}
  
subscription1!:Subscription
subscription2!:Subscription
subscription3!:Subscription
subscription4!:Subscription
subscription5!:Subscription
isEmpty=false
displayButtons=false
data:any
dataSource!:MatTableDataSource<LignePanierDto>
displayedColumns:string[]=["Produit","Intitule","Prix_TTC","Quantite","Sous-total"]
@ViewChild(MatPaginator) paginator !: MatPaginator
  updateLignePanier(ligne:LignePanierDto,quantity:number){
   this.subscription1=this.backend.updateLignePanier(ligne.id,quantity).subscribe({next:(data)=>{
      ligne=data
      console.log(data)
      console.log(ligne)
      console.log("ligne is updated")
    },error:(error)=>{console.log(error)
      console.log(error.error)
    },complete:()=>{
    console.log("everything done")
this.getAllLignePanier()
  }
    
    })
  }
  
      changeValue(ligne:LignePanierDto,input:any){
        console.log("blur event")
        console.log(ligne)
        if(!Number.isInteger(Number.parseInt(input.value)) || input.value<=0){
          input.value=ligne.ligneQuantite
        }else{
          if(input.value!=ligne.ligneQuantite){
            ligne.ligneQuantite=input.value
            console.log(ligne.id)
          this.updateLignePanier(ligne,input.value)
        }  
          this.subtotalUpdate() 
        }

      
        }
      lignes:LignePanierDto[]=[]
  getAllLignePanier(){
    this.subscription2=this.backend.getAllPanierLignes(this.username).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.lignes=data.body
      console.log(this.lignes)
      
      if(this.lignes.length==0){
        this.isEmpty=true
      }
      this.dataSource=new MatTableDataSource<LignePanierDto>(this.lignes)
        this.dataSource.paginator=this.paginator
      this.displayButtons=true
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
    this.subtotalUpdate()
  })
}
deleteLignePanier(id:number){
  this.subscription3=this.backend.deleteLignePanierById(id).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
      console.log(data.body)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
 this.getAllLignePanier()
 this.panierCommunicator.emitEvent()
})
}
deleteAllLignes(){
  if(this.lignes.length!=0){
    this.subscription4=this.backend.deleteAllLignesPanier(this.username).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    //this.toaster.success("votre panier est vide","Terminé avec succées")
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
  this.getAllLignePanier()
  this.panierCommunicator.emitEvent()
})
}else{
  this.toaster.warning("panier deja vide","Terminé avec echec")
}
}
AddCommand(){
  let command=new CommandeDto(this.idClient,this.username,this.lignes)
  this.subscription5=this.backend.AddCommand(command).subscribe({next:(data)=>{
    
    console.log(data.body)
    console.log("command is added")
    this.toaster.success("commande est en cours de traitement","Terminé avec succées",{disableTimeOut:true})
  },error:(error)=>{console.log(error)
    console.log(error.error)
  },complete:()=>{
  console.log("everything done")
  this.deleteAllLignes()
this.getAllLignePanier()
this.panierCommunicator.emitEvent()
}
  
  })
}
/*AddCommandForTest(){
  let command=new CommandeDto(this.idClient,this.username,this.lignes)
  this.subscription5=this.backend.AddCommand(command).subscribe({next:(data)=>{
    
    console.log(data.body)
    console.log("command is added")
    this.toaster.success(data.body,"Terminé avec succées",{disableTimeOut:true})
  },error:(error)=>{console.log(error)
    console.log(error.error)
  },complete:()=>{
  console.log("everything done")
  console.log("everything done")
  this.deleteAllLignes()
this.getAllLignePanier()
this.panierCommunicator.emitEvent()
}
  
  })
}*/

      subTotal=0
  quantity=0
  username:any
  idClient:any
  ngOnInit(): void {
    this.username=this.storage.getUser()?.username
    this.idClient=this.storage.getUser()?.idClient
    this.getAllLignePanier()
  }
subtotalUpdate(){
  this.subTotal=0
  for(let ligne of this.lignes){
    this.subTotal=this.subTotal+ligne.ligneTotalTtc
  }
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
/*changeValue(ligne:LignePanierDto,input:any){
    console.log("blur event")
    console.log(ligne)
    if(!Number.isInteger(Number.parseInt(input.value)) || input.value<=0){
      input.value=ligne.ligneQuantite
    }else{
      ligne.ligneQuantite=input.value
      ligne.ligneTotalTtc=ligne.tarifttc*ligne.ligneQuantite
      this.subtotalUpdate()
    }
 
      }*/
/*updateQuantity(ligne:LignePanierDto,qte:number){
  ligne.ligneQuantite=qte
   ki tsave ligne panier save tarif avec ttc mch tarif barka  w zid chof hkeyat tarif fl kol
  ligne.ligneTotalTtc=ligne.tarifttc*ligne.ligneQuantite
  this.subtotalUpdate()
}*/
/*updatePanierLignes(){
  let panierToStore:LignePanier[]=[]
  for(let item of this.lignes){
    let ligne=new LignePanier(item.articleId,item.ligneQuantite,this.username)
    panierToStore.push(ligne)
  }
  if(panierToStore.length!=0){
      this.backend.addAllLignePanier(panierToStore).subscribe((data)=>{
        console.log(data.status)
        if(data.body!=null){
        console.log(data)
        this.toaster.success(data.body.message)
        
      }},(error)=>{
        console.log(error.status)
      console.log(error.error)
     
      },()=>{
        console.log("no problem")
      
    })
  }else{
    this.toaster.warning("panier est vide")
  }
    
}*/
/*data:any
  updateLigneCommand(ligne:CommandLigne,quantity:number){
    this.backend.updateLigneCommand(ligne.ligneId,quantity).subscribe({next:(data)=>{
      ligne=data
      console.log(data)
      console.log(ligne)
      console.log("ligne is updated")
    },error:(error)=>{console.log(error)
      console.log(error.error)
    },complete:()=>{
    console.log("everything done")
  this.getAllCommandLignes()
  }
    
    })
  }
  changeValue(ligne:CommandLigne,input:any){
console.log("blur event")
console.log(ligne)
if(input.value<=0){
  input.value=ligne.ligneQuantite
}else{
  if(input.value!=ligne.ligneQuantite){
  this.updateLigneCommand(ligne,input.value)
}
console.log(input.value)
console.log(ligne.ligneQuantite)
}
  }
commandLines:CommandLigne[]=[]
username:any
clientId=0
  ngOnInit(): void {
    this.username=this.storage.getUser()?.username
    this.clientId=Number(this.storage.getUser()?.idClient)
    this.getAllCommandLignes()
  }
  commandLignes:CommandLigne[]=[]
  getAllCommandLignes(){
    this.backend.getAllCommandLignesByUser(this.username).subscribe((data)=>{
      console.log(data.status)
      if(data.body!=null){
      this.commandLignes=data.body
      console.log(this.commandLignes)
    }},(error)=>{
      console.log(error.status)
    console.log(error.error)
    },()=>{console.log("no problem")
    this.subtotalUpdate()
  })
}
deleteAllLignes(){
  this.backend.deleteAllLignesCommandes(this.username).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
    this.toaster.success("votre panier est vide")
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
  this.getAllCommandLignes()
})
}
deleteLigneCommandById(id:number){
  this.backend.deleteLigneCommandeById(id).subscribe((data)=>{
    console.log(data.status)
    if(data.body!=null){
      console.log(data.body)
  }},(error)=>{
    console.log(error.status)
  console.log(error.error)
  },()=>{console.log("no problem")
  this.getAllCommandLignes()
})
}
subTotal=0
subtotalUpdate(){
  this.subTotal=0
  for(let ligne of this.commandLignes){
    this.subTotal=this.subTotal+ligne.ligneTotalTtc
  }
}
AddCommand(){
  let command=new CommandeDto(this.clientId,this.username,this.commandLignes)
  this.backend.AddCommand(command).subscribe({next:(data)=>{
    
    console.log(data.body)
    console.log("command is added")
  },error:(error)=>{console.log(error)
    console.log(error.error)
  },complete:()=>{
  console.log("everything done")
this.getAllCommandLignes()
}
  
  })
}
*/

}
