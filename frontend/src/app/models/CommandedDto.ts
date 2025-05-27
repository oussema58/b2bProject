import { CommandLigne } from "./CommandLigne"
import { LignePanier } from "./LignePanier"
import { LignePanierDto } from "./LignePanierDto"

export class CommandeDto{
    clientId:number
    username:string
    lignes:LignePanierDto[]
    constructor( clientId:number,username:string,lignes:LignePanierDto[]){
        this.clientId=clientId
        this.username=username
        this.lignes=lignes

    }
}