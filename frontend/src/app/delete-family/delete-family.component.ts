import { Component, Inject, OnDestroy } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-family',
  templateUrl: './delete-family.component.html',
  styleUrls: ['./delete-family.component.css']
})
export class DeleteFamilyComponent implements OnDestroy {
  constructor(private backend:BackendService,private toaster:ToastrService,@Inject(MAT_DIALOG_DATA) private idCategory:number,
  private refMat:MatDialogRef<DeleteFamilyComponent>){

  }
 
  data:any
  subscription1!:Subscription
  confirm(){
this.subscription1=this.backend.deleteFamily(this.idCategory).subscribe((response)=>{
console.log(response.status)
console.log(response.body)
if(response.body!=null){
this.toaster.success(response.body.message,"delete successful")
}
},(error)=>{
console.log(error)
console.log(error.error)
this.toaster.error(error.error,"delete failed")
},()=>{this.refMat.close(true)})
  }
cancel(){
  this.refMat.close(true)
  }
  ngOnDestroy(): void {
    if(this.subscription1){
    this.subscription1.unsubscribe()
  }
  }
}
