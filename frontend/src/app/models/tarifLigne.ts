import { Article } from "./article"

export class TarifLigne{
    tarifId :number
    tarifPrix:number
    //articleId:number
    articleIntitule:string=""
    article:Article
    enVente=false
    constructor(tarifPrix:number,articleIntitule:string,articleElem:Article,tarifId :number){
this.tarifPrix=tarifPrix
this.articleIntitule=articleIntitule
this.article=articleElem
this.tarifId=tarifId
}
}