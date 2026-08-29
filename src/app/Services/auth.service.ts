import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Login, Register } from '../Interfaces/register';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken:string = ""
  private apiUrl = 'https://evalautioncompany-42df5.containers.snapdeploy.app/api/Auth/Login'
  companyId : BehaviorSubject<number> = new BehaviorSubject(-1);
  role : BehaviorSubject<string> = new BehaviorSubject("")

  constructor(private _HttpClient:HttpClient , private _Router :Router , @Inject(PLATFORM_ID) private platFormId:object)
  {
    if(isPlatformBrowser(platFormId))
    {
      this.companyId.next(Number(localStorage.getItem('companyId'))) // 29


    }
  }
  getRegister(data: Register): Observable<any>
{
  const token = this.userToken || localStorage.getItem('userToken');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this._HttpClient.post(
    "https://evalautioncompany-42df5.containers.snapdeploy.app/api/Auth/register",
    data,
    { headers }
  );
}
  sendlogin (data:Login) : Observable<any>
  {
    return this._HttpClient.post("https://evalautioncompany-42df5.containers.snapdeploy.app/api/Auth/Login",data)
  }
  sendToken()
  {
   localStorage.getItem("userToken")
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this._HttpClient.post(this.apiUrl, credentials);
  }

  logOut()
  {
  localStorage.removeItem("userToken")
  localStorage.removeItem("companyId")

  }

}
