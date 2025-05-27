export class LigneWishlistDto{
    id:number
    articleId:number
    tarif:number
    tva:number
     articleIntitule:string 
    articleCode:string
    dateCreate:Date
    tarifttc:number
    articleImage:string=""
    
    constructor(id:number,articleId:number,articleIntitule:string,articleCode:string,
        tarif:number,tva:number,dateCreate:Date,tarifttc:number){
    this.id=id
    this.articleId=articleId
    this.tarif=tarif
    this.dateCreate=dateCreate
    this.tva=tva
    this.articleIntitule=articleIntitule
    this.articleCode=articleCode
    this.tarifttc=tarifttc
        }
}