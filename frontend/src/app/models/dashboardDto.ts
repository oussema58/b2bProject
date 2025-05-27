export class DashboardDto{
    nbCommandeClient:number
    nbCommandeSociete:number
    nbRetourClient:number
    nbRetourSociete:number
    nbPanier:number
    nbWishlist:number
    nbCompte:number
    constructor( nbCommandeClient:number,nbCommandeSociete:number,nbRetourClient:number
        ,nbRetourSociete:number,nbPanier:number,nbWishlist:number,nbCompte:number){
this.nbCommandeClient=nbCommandeClient
this.nbCommandeSociete=nbCommandeSociete
this.nbRetourClient=nbRetourClient
this.nbRetourSociete=nbRetourSociete
this.nbPanier=nbPanier
this.nbWishlist=nbWishlist
this.nbCompte=nbCompte
    }
}
