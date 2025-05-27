import { MatDateFormats } from "@angular/material/core";
import { User } from "./user";

export class Client{
    id:number;
    email:string;
    code:string
    intitule:string;
    matricule_Fiscale:string;
    adresse:string;
    ville:string;
    codePostale:string;
    telephone:string;
    dateCreate:Date;  
    dateUpdate:Date 
    users:User[];
    userCreate:string;
    userUpdate:string;
    etat=true
    imagePath=""
    imageContent=""
    constructor(Id:number,email:string,code:string,intitule:string,matricule_Fiscale:string,adresse:string,ville:string,codePostale:string,
        telephone:string,dateCreate:Date,users:User[],userCreate:string,dateUpdate:Date,userUpdate:string){
           
            this.id=Id
            this.email=email
            this.code=code
            this.intitule=intitule
            this.matricule_Fiscale=matricule_Fiscale
            this.adresse=adresse
            this.ville=ville
            this.codePostale=codePostale
            this.telephone=telephone
            this.dateCreate=dateCreate
            this.users=users
            this.userCreate=userCreate
this.userUpdate=userUpdate
this.dateUpdate=dateUpdate
        }
}