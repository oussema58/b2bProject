import { FormControl } from "@angular/forms";
export const PasswordFormatValidator=(control:FormControl)=>{
   /* const validator=/^([<>$%?&]|[A-Z]|[0-9])+$/
    console.log("inside custom vaidator")
    if(!validator.test(control.value)){
        console.log("right here")
        return {PasswordFormat:true}
    
    }else{
        return null
    }
    */
    const containsCapital= /^(.)*[A-Z](.)*$/;
    const containsLower=/^(.)*[a-z](.)*$/
    const containsNumeric=/^(.)*[0-9](.)*$/
    const containsSpecial=/^(.)*[<>$%?&](.)*$/
    
   if(((control.value.length>=6) &&containsCapital.test(control.value) &&
    containsLower.test(control.value) && containsNumeric.test(control.value) && 
    containsSpecial.test(control.value)) || control.value==""){

       return null
    }else{
        return {PasswordFormat:true}
    }
}