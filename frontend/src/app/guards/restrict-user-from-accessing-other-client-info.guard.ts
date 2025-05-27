import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { router } from 'ngx-bootstrap-icons';
import { ToastrService } from 'ngx-toastr';

export const restrictUserFromAccessingOtherClientInfoGuard: CanActivateFn = (route, state) => {
  let storageService=inject(StorageService)
  let router=inject(Router)
  let toaster=inject(ToastrService)
  if(storageService.getUser()?.role=="CLIENT"){
let idClient=Number(route.paramMap.get("clientId"))
  console.log("i am inside restrict client guard and i amchecking the id that is ")
  console.log(idClient)
  let userClientId=Number(storageService.getUser()?.idClient)
  if(idClient==userClientId){
    return true
  }else{
    toaster.error("you don t have enough privleges")
    router.navigate(["/dashboard/client/"+userClientId+"/detail"])
    return false
  }
  }
  return true
};
