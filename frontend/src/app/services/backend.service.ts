import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/loginDto';
import { Client } from '../models/client';
import { User } from '../models/user';
import { Catalogue } from '../models/catalogue';
import { Family } from '../models/family';
import { Tax } from '../models/tax';
import { Article } from '../models/article';
import { TarifEntDto } from '../models/TarifEntDto';
import { CatalogueKeyPair } from '../models/catalogueKeyPair';
import { TarifEnt } from '../models/tarifEnt';
import { CommandLigne } from '../models/CommandLigne';
import { Commande } from '../models/Commande';
import { CommandeDto } from '../models/CommandedDto';
import { ArticleInStore } from '../models/ArticleInStore';
import { LignePanier } from '../models/LignePanier';
import { LignePanierDto } from '../models/LignePanierDto';
import { Motif } from '../models/motif';
import { DemandeRetourDto } from '../models/demandeRetourDto';
import { DemandeRetour } from '../models/demandeRetour';
import { UserDto } from '../models/userDto';
import { CommandeDto2 } from '../models/commandeDto2';
import { LigneWishlist } from '../models/LigneWishlist';
import { DashboardDto } from '../models/dashboardDto';
import { DashboardAdminDto } from '../models/dashboardAdminDto';
import { CommandeByCategory } from '../models/CommandeByCategory';
import { BestArticle } from '../models/bestArticles';
import { BestClient } from '../models/bestClient';
import { LigneWishlistDto } from '../models/LigneWishlistDto';
import { updateCommandeDto } from '../models/updateCommandeDto';
import { CatalogueKeyPair2 } from '../models/CatalogueKeyPair2';



@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url="http://localhost:5083/api"
  constructor(private http:HttpClient) { }
  
login(user:LoginDto){
return this.http.post<any>(this.url+"/login",user,{observe:'response'})
}
/*signup(user:any){
  return this.http.post<any>(this.url+"/signup",user,{observe:'response'})
}*/
/*signup(data:FormData){
  return this.http.post<any>(this.url+"/signup",data,{observe:'response'})
}*/
signup(data:FormData){
  return this.http.post<any>(this.url+"/client/signup",data,{observe:'response'})
}
confirmUser(email:string,token:string){
  return this.http.post<any>(this.url+"/account/user/confirm?token="+token+"&email="+email,{},{observe:'response'})
}
confirmSociety(email:string,token:string,society:string,body:any){
  return this.http.post<any>(this.url+"/account/society/confirm?email="+email+"&token="+token+"&society="+society,{body},{observe:'response'})
}
DeclineSociety(email:string,token:string,society:string){
  return this.http.post<any>(this.url+"/account/society/confirm?email="+email+"&token="+token+"&society="+society,{},{observe:'response'})
}
getInfo(){
  return this.http.get<any>(this.url+"/info",{observe:'response'})
}
getClients(){
  return this.http.get<Client[]>(this.url+"/client",{observe:'response'})
}
getMeilleurClients(){
  return this.http.get<BestClient[]>(this.url+"/client/meilleur",{observe:'response'})
}
getClient(id:Number){
  return this.http.get<Client>(this.url+"/client/"+id,{observe:'response'})
}
/*updateClient(client:Client,id:Number){
  return this.http.put<Client>(this.url+"/client/"+id,client,{observe:'response'})
}*/
updateClient(data:FormData,id:Number){
  return this.http.put<any>(this.url+"/client/"+id,data,{observe:'response'})
}
deleteClient(id:number){
  return this.http.delete<any>(this.url+"/client/"+id,{observe:'response'})
}
blockClient(id:number){
  return this.http.put<any>(this.url+"/client/"+id+"/block",{observe:'response'})
}
unblockClient(id:number){
  return this.http.put<any>(this.url+"/client/"+id+"/unblock",{observe:'response'})
}
getUsersByClient(id:Number){
  return this.http.get<User[]>(this.url+"/"+id+"/user",{observe:'response'})
}
updateUserByAdmin(userToUpdate:any,id:string){
return this.http.put<any>(this.url+"/admin/update/user/"+id,userToUpdate,{observe:"response"})
}
updateUser(formData:FormData,id:string){
  return this.http.put<any>(this.url+"/user/v2/"+id,formData,{observe:"response"})
}
deleteUser(id:string){
  return this.http.delete<any>(this.url+"/user/"+id,{observe:'response'})
}
blockUser(username:string){
  return this.http.put<any>(this.url+"/user/"+username+"/block",{observe:'response'})
}
unblockUser(username:string){
  return this.http.put<any>(this.url+"/user/"+username+"/unblock",{observe:'response'})
}
getUserById(id:string){
  return this.http.get<UserDto>(this.url+"/user/"+id,{observe:'response'})
}
getUser(){
  return this.http.get<UserDto>(this.url+"/user",{observe:'response'})
}
updatePassword(body:any){
  return this.http.put<any>(this.url+"/account/reset-password",body,{observe:'response'})
  
}
/*
updateUser(data:FormData){
  return this.http.put<any>(this.url+"/user",data,{observe:'response'})
}*/
findCategoryLevel3Parent(name:string){
  return this.http.get<{category2:string,category1:string}>(this.url+"/catalogue/parent/"+name,{observe:'response'})
}
getAllCategories(){
  return this.http.get<Catalogue[]>(this.url+"/catalogue?divide=false",{observe:'response'})
}
getAllCategoriesDividedForAdmin(){
  return this.http.get<CatalogueKeyPair[]>(this.url+"/catalogue/admin?divide=true",{observe:'response'})
}
 /*getAllCategoriesDividedEvenIfEmptyForAdmin(){
   return this.http.get<CatalogueKeyPair[]>(this.url+"/catalogue/admin/all",{observe:'response'})
}*/
getAllCategoriesDividedEvenIfEmptyForAdmin(){
  return this.http.get<CatalogueKeyPair2[]>(this.url+"/catalogue/admin/all",{observe:'response'})
}

getAllCategoriesDividedForUser(){
  return this.http.get<CatalogueKeyPair[]>(this.url+"/catalogue?divide=true",{observe:'response'})
}
getCategorieLevel2(id:number){
  return this.http.get<CatalogueKeyPair>(this.url+"/catalogue/"+id,{observe:'response'})
}

getCategorieLevel1(name:string){
  return this.http.get<CatalogueKeyPair>(this.url+"/catalogue/level1/"+name,{observe:'response'})
}
getCategorieLevel3Active(){
  return this.http.get<Catalogue[]>(this.url+"/catalogue/level3",{observe:'response'})
}
addCategory(catalogue:Catalogue){
  return this.http.post<any>(this.url+"/catalogue",catalogue,{observe:'response'})
}
updateCategory(catalogue:Catalogue,id:number){
  return this.http.put<any>(this.url+"/catalogue/"+id,catalogue,{observe:'response'})
}
deleteCategory(id:number){
  return this.http.delete<any>(this.url+"/catalogue/"+id,{observe:'response'})
}
getAllFamillies(){
  return this.http.get<Family[]>(this.url+"/famille",{observe:'response'})
}
addFamily(famille:any){
  return this.http.post<any>(this.url+"/famille",famille,{observe:'response'})
}
updateFamily(famille:any,id:number){
  return this.http.put<any>(this.url+"/famille/"+id,famille,{observe:'response'})
}
deleteFamily(id:number){
  return this.http.delete<any>(this.url+"/famille/"+id,{observe:'response'})
}
getTaxs(){
  return this.http.get<Tax[]>(this.url+"/taxe",{observe:'response'})
}
addTax(tax:any){
  return this.http.post<any>(this.url+"/taxe",tax,{observe:'response'})
}
updateTax(tax:any,id:number){
  return this.http.put<any>(this.url+"/taxe/"+id,tax,{observe:'response'})
}
deleteTax(id:number){
  return this.http.delete<any>(this.url+"/taxe/"+id,{observe:'response'})
}

getArticles(){
  return this.http.get<Article[]>(this.url+"/article",{observe:'response'})
}
getActiveArticles(){
  return this.http.get<Article[]>(this.url+"/article/active",{observe:'response'})
}
getMeilleursArticles(){
  return this.http.get<BestArticle[]>(this.url+"/article/meilleur",{observe:'response'})
}
getArticle(id:number){
  return this.http.get<Article>(this.url+"/article/"+id,{observe:'response'})
}

getArticleInStoreById(id:number){
  return this.http.get<ArticleInStore>(this.url+"/article/store/"+id,{observe:'response'})
}

getArticlesForUser(categoryId:number){
  return this.http.get<Article[]>(this.url+"/article/category/"+categoryId,{observe:'response'})
}
getArticlesInStoreByCategoryLvl3(CategoryLvl3Name:string){
  return this.http.get<ArticleInStore[]>(this.url+"/article/store/category/"+CategoryLvl3Name,{observe:'response'})
}

getFeaturedArticlesInStore(){
  return this.http.get<ArticleInStore[]>(this.url+"/article/store/featured",{observe:'response'})
}
getRecentArticlesInStore(){
  return this.http.get<ArticleInStore[]>(this.url+"/article/store/recent",{observe:'response'})
}
getBestSellingArticlesInStore(){
  return this.http.get<ArticleInStore[]>(this.url+"/article/store/bestSelling",{observe:'response'})
}
/*
addArticle(article:any){
  return this.http.post<any>(this.url+"/article",article,{observe:'response'})
}*/
addArticle(data:FormData){
  return this.http.post<any>(this.url+"/article",data,{observe:'response'})
}
updateArticle(data:FormData,id:number){
  return this.http.put<any>(this.url+"/article/"+id,data,{observe:'response'})
}
blockArticle(id:number){
  return this.http.put<any>(this.url+"/article/"+id+"/block",{observe:'response'})
}
unblockArticle(id:number){
  return this.http.put<any>(this.url+"/article/"+id+"/unblock",{observe:'response'})
}
/*
updateArticle(article:any,id:number){
  return this.http.put<any>(this.url+"/article/"+id,article,{observe:'response'})
}
*/
deleteArtilce(id:number){
  return this.http.delete<any>(this.url+"/article/"+id,{observe:'response'})
}
addTarif(tarif:TarifEntDto){
  return this.http.post<any>(this.url+"/tarif",tarif,{observe:'response'})
}
addTarifV2(tarif:TarifEnt){
  return this.http.post<any>(this.url+"/tarif",tarif,{observe:'response'})
}
getAllTarif(){
  return this.http.get<TarifEnt[]>(this.url+"/tarif",{observe:'response'})
}
getTarifById(id:number){
  return this.http.get<TarifEnt>(this.url+"/tarif/"+id,{observe:'response'})
}
deleteTarifEnt(id:number){
  return this.http.delete<any>(this.url+"/tarif/"+id,{observe:'response'})
}
updateTarif(body:TarifEnt,id:number){
  return this.http.put<any>(this.url+"/tarif/"+id,body,{observe:'response'})
}
addUser(id:number,data:FormData){
  return this.http.post<any>(this.url+"/"+id+"/user",data,{observe:'response'})
}
/*
addUser(id:number,user:any){
  return this.http.post<any>(this.url+"/"+id+"/user",user,{observe:'response'})
}*/
 addLigneCommand(body:CommandLigne){
  return this.http.post<any>(this.url+"/ligneCommand",body,{observe:'response'})
 }
 getAllCommandLignesByUser(username:string){
  return this.http.get<CommandLigne[]>(this.url+"/ligneCommand/user/"+username,{observe:'response'})
 }
 updateLigneCommand(id:number,quantity:number){
  return this.http.put<any>(this.url+"/ligneCommand/"+id+"?quantity="+quantity,{observe:'response'})
 }
 deleteAllLignesCommandes(username:string){
  return this.http.delete<any>(this.url+"/ligneCommand/user/"+username,{observe:'response'})
 }
 deleteLigneCommandeById(id:number){
  return this.http.delete<any>(this.url+"/ligneCommand/"+id,{observe:'response'})
 }
 AddCommand(body:CommandeDto){
  return this.http.post<any>(this.url+"/command",body,{observe:'response'})
 }
 getAllCommandesByClient(clientId:string){
  return this.http.get<CommandeDto2[]>(this.url+"/command/user/"+clientId,{observe:'response'})
 }
 /*updateCommandStatus(idCommand:number,status:string){
  return this.http.put<any>(this.url+"/command/"+idCommand+"/status/"+status,{observe:'response'})
  //command/{idCommand}/status/{status}
 }*/
 updateCommandStatus(idCommand:number,body:updateCommandeDto){
  return this.http.put<any>(this.url+"/command/"+idCommand,body,{observe:'response'})
  
 }
 getAllCommandes(){
  return this.http.get<Commande[]>(this.url+"/command",{observe:'response'})
 }
 getCommandesByCatalogues(){
  return this.http.get<CommandeByCategory[]>(this.url+"/command/v2",{observe:'response'})
 }
 getCommandeById(id:number){
  return this.http.get<any>(this.url+"/command/"+id,{observe:'response'})
 }

 addLignePanier(ligne:LignePanier){
  return this.http.post<any>(this.url+"/panier",ligne,{observe:'response'})
 }
 addAllLignePanier(ligne:LignePanier[]){
  return this.http.post<any>(this.url+"/panier/all",ligne,{observe:'response'})
 }
 getAllPanierLignes(username:string){
  return this.http.get<LignePanierDto[]>(this.url+"/panier/user/"+username,{observe:'response'})
 }
 deleteLignePanierById(id:number){
  return this.http.delete<any>(this.url+"/panier/"+id,{observe:'response'})
 }
 updateLignePanier(id:number,quantity:number){
  return this.http.put<any>(this.url+"/panier/"+id+"?quantity="+quantity,{observe:'response'})
 }
 deleteAllLignesPanier(username:string){
  return this.http.delete<any>(this.url+"/panier/user/"+username,{observe:'response'})
 }
 addLigneWishlist(ligne:LigneWishlist){
  return this.http.post<any>(this.url+"/wishlist",ligne,{observe:'response'})
 }
 deleteLigneWishlistById(id:number){
  return this.http.delete<any>(this.url+"/wishlist/"+id,{observe:'response'})
 }
 getAllLignesWishlist(){
  return this.http.get<LigneWishlistDto[]>(this.url+"/wishlist",{observe:'response'})
 }
 getAllMotifs(){
  return this.http.get<Motif[]>(this.url+"/motif",{observe:'response'})
 }
 addMotif(body:any){
  return this.http.post<any>(this.url+"/motif",body,{observe:'response'})
 }
 deleteMotif(id:number){
  return this.http.delete<any>(this.url+"/motif/"+id,{observe:'response'})
 }
 addDemandeRetour(body:DemandeRetourDto){
  return this.http.post<any>(this.url+"/demandeRetour",body,{observe:'response'}) 
 }
 getAllDemandeRetour(){
  return this.http.get<DemandeRetour[]>(this.url+"/demandeRetour",{observe:'response'})
 }
 getAllDemandeRetourByClient(idClient:number){
  return this.http.get<DemandeRetour[]>(this.url+"/demandeRetour/client/"+idClient,{observe:'response'})
 }
 getDemandeRetourById(id:number){
  return this.http.get<DemandeRetour>(this.url+"/demandeRetour/"+id,{observe:'response'})
 }
 getDashboardInfo(){
  return this.http.get<DashboardDto>(this.url+"/user/dashboard",{observe:'response'})
 }
 getDashboardAdminInfo(){
  return this.http.get<DashboardAdminDto>(this.url+"/admin/dashboard",{observe:'response'})
 }
 incrementView(data:FormData){
  return this.http.post<any>(this.url+"/articleView",data,{observe:'response'})
 }
 getBestConsultedArticles(){
  return this.http.get<ArticleInStore[]>(this.url+"/article/store/bestConsulted",{observe:'response'})
 }
}
