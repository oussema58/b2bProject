import { Article } from "./article";

export class LignePanierDto{
    id:number
articleId:number
tarif:number
tva:number
 articleIntitule:string 
articleCode:string
ligneQuantite:number
ligneTotalHt:number
ligneTotalTtc:number
ligneTotalTaxes:number
dateCreate:Date
tarifttc:number
articleImage=""
constructor(id:number,articleId:number,articleIntitule:string,articleCode:string,
    tarif:number,ligneQuantite:number,ligneTotalHt:number,ligneTotalTtc:number,ligneTotalTaxes:number,tva:number,dateCreate:Date,tarifttc:number){
this.id=id
this.articleId=articleId
this.tarif=tarif
this.ligneQuantite=ligneQuantite
this.ligneTotalHt=ligneTotalHt
this.ligneTotalTtc=ligneTotalTtc
this.ligneTotalTaxes=ligneTotalTaxes
this.dateCreate=dateCreate
this.tva=tva
this.articleIntitule=articleIntitule
this.articleCode=articleCode
this.tarifttc=tarifttc
    }
}