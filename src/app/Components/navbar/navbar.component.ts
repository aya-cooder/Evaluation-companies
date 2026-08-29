import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  islogin :boolean = false
  constructor(private _Router: Router, private _AuthService: AuthService) {}

  ngOnInit(): void {

    this._AuthService.companyId.subscribe(()=>{

      if( this._AuthService.companyId.getValue() == -1 )
      {

        this.islogin = false
      }
      else{
        this.islogin = true
      }

    })
  }

  logout() {
    this._Router.navigate(["home"]);
   this._AuthService.logOut()
  }

}
