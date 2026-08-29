// dash-board.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  activeLink: string = '';
  isAdmin: boolean = false;


  isSideBarEnable: boolean = true;
  activeSubMenu: string | null = null;
  constructor(private router: Router ,private authService:AuthService ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects;
      }
    });
  }

  isActive(link: string): boolean {
    return this.activeLink === link;
  }

  

  ngOnInit(): void {
    const roles = localStorage.getItem("userRoles");
    console.log("Roles from localStorage during initialization:", roles); // التحقق هنا
  
    if (roles) {
      const parsedRoles = JSON.parse(roles); // تحويل النص إلى مصفوفة
      console.log("Parsed roles:", parsedRoles); // التأكد من الأدوار المحللة
      this.isAdmin = parsedRoles.includes('admin'); // التحقق من وجود 'admin'
      console.log("Is Admin:", this.isAdmin); // طباعة ما إذا كان المستخدم أدمن
    } else {
      console.log("No roles found in localStorage");
    }
  }
  
  

  toggleSideBar(): void {
    this.isSideBarEnable = !this.isSideBarEnable;
  }

  toggleSubMenu(subMenu: string) {
    if (this.activeSubMenu === subMenu) {
      this.activeSubMenu = null;
    } else {
      this.activeSubMenu = subMenu;
    }
  }
  logout(): void {
    this.authService.logOut(); // Call the logout method from AuthService
    this.router.navigate(['/Home']); // Redirect to home page after logging out
  }

}
