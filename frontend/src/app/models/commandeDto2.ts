import { CommandLigne } from "./CommandLigne"
import { Statut } from "./Statut"
import { Client } from "./client"
import { DemandeRetour } from "./demandeRetour"
import { User } from "./user"

export class CommandeDto2{
commandeId:number
commandeNumero:string
commandeDate:Date
commandeTotalHt:number
commandeTotalTtc:number
commandeTotalTaxes:number
commandesNbrArticles:number
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
demandeRetour:DemandeRetour
constructor(commandeId:number,commandeNumero:string,commandeDate:Date,commandeTotalHt:number
    ,commandeTotalTtc:number,commandeTotalTaxes:number,commandesNbrArticles:number,client:Client,
    clientId:number,clientIntitule:string,clientCode:string,commandeDateLivraisonPrevue:Date,dateCreate:Date,userCreate:User,statut:Statut
    ,statutId:number,lignes:CommandLigne[],demandesRetour:DemandeRetour){
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
this.demandeRetour=demandesRetour
}
}