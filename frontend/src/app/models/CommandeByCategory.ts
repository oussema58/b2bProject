import { CommandLigne } from "./CommandLigne";

export interface CommandeByCategory{
    catalogue:string
    lignes:CommandLigne[]
    totalVente:number
    totalRevenue:number
}
