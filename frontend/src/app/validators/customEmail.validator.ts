import { FormControl } from "@angular/forms";

export const EmailFormatValidator=(control:FormControl)=>{
    const EmailFormatValidator=/^([A-Za-z0-9])+@([A-Za-z0-9])+[.]([A-Za-z])+$/;
    console.log("inside custom email vaidator")
    if(control.value!="" && !EmailFormatValidator.test(control.value) ){
        console.log("right here")
        return {EmailFormat:true}
    }else{
        return null
    }
}