import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class autuInterceptor implements HttpInterceptor {
constructor(){}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
const token = localStorage.getItem('userToken')
const newCloneRequest = req.clone({
setHeaders:{

Authorization:` Bearer ${token} `

}
})
 return next.handle(newCloneRequest)
  }
}
