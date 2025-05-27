import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private storage:StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
var token=this.storage.getUser()
if(token!=null){
    var newRequest=request.clone({setHeaders:{"Authorization":"Bearer "+token.token}})
    return next.handle(newRequest)
  }
    return next.handle(request);
  }
}
