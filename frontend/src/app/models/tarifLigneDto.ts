import { Article } from "./article";

export class TarifLigneDto{
    tarifPrix:number
    articleId:number
    articleElem:Article
    constructor(tarifPrix:number,articleId:number,articleElem:Article){
this.tarifPrix=tarifPrix
this.articleId=articleId
this.articleElem=articleElem
    }
}