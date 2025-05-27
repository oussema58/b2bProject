import { TarifLigneDto } from "./tarifLigneDto";


export class TarifEntDto {
    tarif_Entete_intitule: string;
    tarif_Entete_Code: string;
    tarif_Entete_DateFin: Date;
    tarifLignes: TarifLigneDto[];
    constructor(  tarif_Entete_intitule: string,tarif_Entete_Code: string,tarif_Entete_DateFin:Date,tarifLignes: TarifLigneDto[]){
this.tarif_Entete_intitule=tarif_Entete_intitule
this.tarif_Entete_Code=tarif_Entete_Code
this.tarif_Entete_DateFin=tarif_Entete_DateFin
this.tarifLignes=tarifLignes
    }
}
