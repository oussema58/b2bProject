import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(StorageService); // Replace with your service path
  const toaster=inject(ToastrService)
  const router=inject(Router)
if(authService.isConnected()){
  let roles= route.data["role"] as string[]
  if(roles.includes(String(authService.getUser()?.role))){
    return true
  }else{
    toaster.error("you don t have necessary privleges")
router.navigate(["/unauthorized"])
return false
  }
}else{
toaster.error("you should log in first")
router.navigate(["/login"])
return false
}
};
