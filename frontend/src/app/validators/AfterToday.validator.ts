import { FormControl } from "@angular/forms";

export const AfterTodayValidator=(control:FormControl)=>{
    console.log("after today validator is executing")
let current=new Date()
console.log(control.value)
let chosen=new Date(Date.parse(control.value))
console.log(chosen)
console.log(current)
console.log(chosen.getUTCFullYear())
console.log(current.getUTCFullYear())
console.log(chosen.getUTCMonth())
console.log(current.getUTCMonth())
console.log(chosen.getUTCDate())
console.log(current.getUTCDate())
if(current.getUTCFullYear()>chosen.getUTCFullYear()){
    return {afterToday:true}
}
if(current.getUTCFullYear()<chosen.getUTCFullYear()){
    return null
}
if(current.getUTCMonth()>chosen.getUTCMonth()){
    return {afterToday:true}
}
if(current.getUTCMonth()<chosen.getUTCMonth()){
    return null
}
if(current.getUTCDate()>chosen.getUTCDate()){
    return {afterToday:true}
}
return null
}