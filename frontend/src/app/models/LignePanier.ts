import { Article } from "./article"
import { User } from "./user"

export class LignePanier{
    id:number
    articleId:number
    ligneQuantite:number
    username:string
    constructor(articleId:number,ligneQuantite:number,username:string){
        this.id=0
this.articleId=articleId
this.ligneQuantite=ligneQuantite
this.username=username
    }
}