import { Commande } from "./Commande"
import { Client } from "./client"

export interface BestClient{
    imagePath:string
    intitule:string
totalVente:number
totalRevenue:number
nbCommandes:number
commandes:Commande[]
imageContent:string
}