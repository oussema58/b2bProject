export class CatalogueKeyPair2{
    id:number
    value:CatalogueKeyPair2[]
    name:string
    parentId:number
    niveau:number
    isExpanded=false
    constructor( id:number,value:CatalogueKeyPair2[],name:string,parentId:number,niveau:number){
        this.id=id
        this.value=value
        this.name=name
        this.parentId=parentId
        this.niveau=niveau
    }
}