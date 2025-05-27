import { Injectable } from '@angular/core';
import { LoginResult } from '../models/loginResult';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
private secret="4E617134F37DD38EE61C1FD8DB85C";
encryptedUser="";
  constructor() {
   }

   storeUser(user:LoginResult){
let userToEncrypt:string=JSON.stringify(user)
console.log(userToEncrypt)
    let encryptedUser=CryptoJS.AES.encrypt(userToEncrypt,this.secret).toString();
    localStorage.setItem("user",encryptedUser)
   }
   getUser(){
    let user:LoginResult
    let stringifiedUser:any
    if(localStorage.getItem("user")!=null){
      stringifiedUser=localStorage.getItem("user")
    }else{
      return null
    } 
    var decrypted=CryptoJS.AES.decrypt(stringifiedUser,this.secret).toString(CryptoJS.enc.Utf8)
    user=JSON.parse(decrypted)
  return user 
  }
  isConnected(){
    return this.getUser()!=null?true:false
  }
  removeUser(){
    localStorage.removeItem("user")
    console.log("user removed")
  }
}
