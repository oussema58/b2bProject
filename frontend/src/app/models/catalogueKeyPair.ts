export class CatalogueKeyPair
{
    id:number
    value:CatalogueKeyPair[]
    name:string
    nbArticle:number
    constructor( id:number,value:CatalogueKeyPair[],name:string){
        this.id=id
        this.value=value
        this.name=name
        this.nbArticle=0
    }
}