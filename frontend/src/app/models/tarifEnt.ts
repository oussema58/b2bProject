import { TarifLigne } from "./tarifLigne";



export class TarifEnt{
    tarifEnteteId:number
    tarif_Entete_intitule: string;
    tarif_Entete_Code: string;
    tarif_Entete_DateFin: Date;
    tarifs: TarifLigne[];
    constructor(  tarif_Entete_intitule: string,tarif_Entete_Code: string,tarif_Entete_DateFin:Date,
        tarifLignes: TarifLigne[],tarifEnteteId:number){
this.tarifEnteteId=tarifEnteteId
this.tarif_Entete_intitule=tarif_Entete_intitule
this.tarif_Entete_Code=tarif_Entete_Code
this.tarif_Entete_DateFin=tarif_Entete_DateFin
this.tarifs=tarifLignes
    }
}