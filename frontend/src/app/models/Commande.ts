import { CommandLigne } from "./CommandLigne"
import { Statut } from "./Statut"
import { Client } from "./client"
import { User } from "./user"

export class Commande{
commandeId:number
commandeNumero:string
commandeDate:Date
commandeTotalHt:number
commandeTotalTtc:number
commandeTotalTaxes:number
commandesNbrArticles:number
commandeRevenue:number=0
client:Client
clientId:number
clientIntitule:string
clientCode:string
commandeDateLivraisonPrevue:Date
dateCreate:Date
userCreate:User
statut:Statut
statutId:number
lignes:CommandLigne[]
constructor(commandeId:number,commandeNumero:string,commandeDate:Date,commandeTotalHt:number
    ,commandeTotalTtc:number,commandeTotalTaxes:number,commandesNbrArticles:number,client:Client,
    clientId:number,clientIntitule:string,clientCode:string,commandeDateLivraisonPrevue:Date,dateCreate:Date,userCreate:User,statut:Statut
    ,statutId:number,lignes:CommandLigne[]){
this.commandeId=commandeId
this.commandeNumero=commandeNumero
this.commandeDate=commandeDate
this.commandeTotalHt=commandeTotalHt
this.commandeTotalTtc=commandeTotalTtc
this.commandeTotalTaxes=commandeTotalTaxes
this.commandesNbrArticles=commandesNbrArticles
this.client=client
this.clientId=clientId
this.clientIntitule=clientIntitule
this.clientCode=clientCode
this.commandeDateLivraisonPrevue=commandeDateLivraisonPrevue
this.dateCreate=dateCreate
this.userCreate=userCreate
this.statut=statut
this.statutId=statutId
this.lignes=lignes

}
}