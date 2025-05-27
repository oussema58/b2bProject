export class Catalogue{
catalogueId:number
catalogueIntitule:string
catalogueNiveau:number
catalogueParentId:number
catalogueParent:Catalogue|null=null
constructor(catalogueId:number,catalogueIntitule:string,catalogueNiveau:number,catalogueParentId:number){
this.catalogueId=catalogueId
this.catalogueIntitule=catalogueIntitule
this.catalogueNiveau=catalogueNiveau
this.catalogueParentId=catalogueParentId
}
}