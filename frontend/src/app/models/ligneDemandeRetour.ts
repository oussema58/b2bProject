import { CommandLigne } from "./CommandLigne";
import { Article } from "./article";
import { DemandeRetour } from "./demandeRetour";
import { Motif } from "./motif";

export class LigneDemandeRetour{
    id:number
nbArticleRetenue:string
motif:Motif
motifId:number
article:Article
articleId:number
artcileIntitule:string
articleCode:string
nbArticleTotale:number
demandeRetour:DemandeRetour
demandeRetourId:number
commandeLigne:CommandLigne
commandeLigneId:number
constructor(id:number,nbArticleRetenue:string,motif:Motif,motifId:number
    ,article:Article,articleId:number,artcileIntitule:string,articleCode:string
    ,nbArticleTotale:number,demandeRetour:DemandeRetour,demandeRetourId:number
    ,commandeLigne:CommandLigne,commandeLigneId:number){
        this.id=id
        this.nbArticleRetenue=nbArticleRetenue
        this.motif=motif
        this.motifId=motifId
        this.article=article
        this.articleId=articleId
        this.artcileIntitule=artcileIntitule
        this.articleCode=articleCode
        this.nbArticleTotale=nbArticleTotale
        this.demandeRetour=demandeRetour
        this.demandeRetourId=demandeRetourId
        this.commandeLigne=commandeLigne
        this.commandeLigneId=commandeLigneId
}
}