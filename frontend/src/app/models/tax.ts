export class Tax{
id:number
taxeCode:string
taxeIntitule:string
taxeTaux:number
constructor(id:number,taxeCode:string,taxeIntitule:string,taxeTaux:number){
    this.id=id
    this.taxeCode=taxeCode
    this.taxeIntitule=taxeIntitule
    this.taxeTaux=taxeTaux
}
}