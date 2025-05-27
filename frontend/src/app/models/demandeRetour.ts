import { command } from "ngx-bootstrap-icons";
import { Client } from "./client";
import { User } from "./user";
import { Commande } from "./Commande";
import { LigneDemandeRetour } from "./ligneDemandeRetour";

export class DemandeRetour{
    id:number
    nbArtcileRetenue:number
    userCreatedBy:User
    userId:string
    client:Client
    clientId:number
    dateCreated:Date
    admin:User 
    adminId:string
   
    lignes:LigneDemandeRetour[]
    commande:Commande
    commandeId:number
    constructor(Id:number,nbArtcileRetenue:number,userCreatedBy:User,userId:string,client:Client,
        clientId:number,dateCreated:Date,admin:User,adminId:string,lignes:LigneDemandeRetour[],
        commande:Commande,commandeId:number){
this.id=Id
this.nbArtcileRetenue=nbArtcileRetenue
this.userCreatedBy=userCreatedBy
this.userId=userId
this.client=client
this.clientId=clientId
this.dateCreated=dateCreated
this.admin=admin
this.adminId=adminId
this.lignes=lignes
this.commande=commande
this.commandeId=commandeId
    }
}