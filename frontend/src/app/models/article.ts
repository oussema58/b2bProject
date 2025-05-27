import { Catalogue } from "./catalogue"
import { Family } from "./family"
import { Tax } from "./tax"
import { User } from "./user"

export class Article{
    articleID:number
    articleCode:string
    articleIntitule:string
    articlePrixHT:number
    taxe:Tax
    articleBarCode:string
    articleEtat:boolean
    articleStatistique:boolean
    catalogue:Catalogue
    famille:Family
    dateCreate:Date
    dateUpdate:Date
    userCreated:User
    UserModified:User
    nbArticleSold:number
    imagePath:string
    imageContent:string=""
    description=""
    constructor(articleID:number,articleCode:string,articleIntitule:string,articlePrixHT:number,taxe:Tax,articleBarCode:string,
        articleEtat:boolean,articleStatistique:boolean,catalogue:Catalogue,famille:Family,
        dateCreate:Date,dateUpdate:Date,userCreated:User,UserModified:User,imagePath:string){
this.articleID=articleID
this.articleCode=articleCode
this.articleIntitule=articleIntitule
this.articlePrixHT=articlePrixHT
this.taxe=taxe
this.articleBarCode=articleBarCode
this.articleEtat=articleEtat
this.articleStatistique=articleStatistique
this.catalogue=catalogue
this.famille=famille
this.dateCreate=dateCreate
this.dateUpdate=dateUpdate
this.UserModified=UserModified
this.userCreated=userCreated
this.nbArticleSold=0
this.imagePath=imagePath
        }
}