import { CommandLigne } from "./CommandLigne";
import { Article } from "./article";

export interface BestArticle{
     article:Article
totalVente:number
totalRevenue:number
lignes:CommandLigne[]
imageContent:string
}