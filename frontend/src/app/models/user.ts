export class User{
id:string; 
name:string;
etat:boolean;
creationDate:Date;
userName:string;
email:string;
phoneNumber:string;
role:string="";
imagePath:string=""
imageContent:string=""
constructor(Id:string,Name:string,etat:boolean,creationDate:Date,UserName:string,Email:string,PhoneNumber:string){
this.id=Id
this.name=Name
this.etat=etat
this.creationDate=creationDate
this.userName=UserName
this.email=Email
this.phoneNumber=PhoneNumber

}
}