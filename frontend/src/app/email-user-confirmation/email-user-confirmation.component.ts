import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, NavigationStart } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-email-user-confirmation',
  templateUrl: './email-user-confirmation.component.html',
  styleUrls: ['./email-user-confirmation.component.css']
})
export class EmailUserConfirmationComponent implements OnInit,OnDestroy {
constructor(private backend:BackendService,private active:ActivatedRoute,private toaster:ToastrService,
  private navigationStart:NavigationStart){
}
  ngOnDestroy(): void {
    if(this.subscription1){
      this.subscription1.unsubscribe()
    }
  }
token=""
email=""
data:any
subscription1!:Subscription
  ngOnInit(): void {
this.active.queryParams.subscribe((params)=>{
  console.log(this.active.pathFromRoot)
this.token=params["token"]
this.email=params["email"]
console.log(this.token)
console.log(this.email)
console.log(this.navigationStart.url)
})
    this.subscription1=this.backend.confirmUser(this.email,this.token).subscribe((data)=>{
this.data=data
console.log(data)

this.toaster.success("youre email is successfully confirmed","Confirmation Accepted")
    },(error)=>{
      this.toaster.error(error.error,"Confirmation Denied")
    console.log(error.status)
    console.log(error.error)
    })
  }

}
