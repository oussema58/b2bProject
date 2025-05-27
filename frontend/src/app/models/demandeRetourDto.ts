import { LigneDemandeRetourDto } from "./ligneDemandeRetourDto"

export class DemandeRetourDto{
lignes:LigneDemandeRetourDto[]
username:string
commandId:number
constructor(lignes:LigneDemandeRetourDto[],username:string,commandId:number){
this.lignes=lignes
this.username=username
this.commandId=commandId
}
}