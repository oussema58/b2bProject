import { Article } from "./article"

export class CommandLigne{
    ligneId:number
  articleId:number
   article!:Article
   articleIntitule:string
   articleCode:string
    articlePrixHt:number
    articlePrixTtc:number
    articleTauxTva:number
    ligneQuantite:number
    ligneTotalHt:number
    ligneTotalTtc:number
    ligneTotalTaxes:number
    username:string
    ligneRevenue:number=0
    dateCreate:Date
    constructor(ligneId:number,articleId:number,
        articleIntitule:string,
        articleCode:string,
         articlePrixHt:number,
         articlePrixTtc:number,
         articleTauxTva:number,
         ligneQuantite:number,
         ligneTotalHt:number,
         ligneTotalTtc:number,
         dateCreate:Date,
         ligneTotalTaxes:number,username:string){
            this.ligneId=ligneId
this.articleId=articleId
this.articleIntitule=articleIntitule
this.articleCode=articleCode
this.articlePrixHt=articlePrixHt
this.articlePrixTtc=articlePrixTtc
this.articleTauxTva=articleTauxTva
this.ligneQuantite=ligneQuantite
this.ligneTotalHt=ligneTotalHt
this.ligneTotalTtc=ligneTotalTtc
this.ligneTotalTaxes=ligneTotalTaxes
this.username=username
this.dateCreate=dateCreate
    }

    
}