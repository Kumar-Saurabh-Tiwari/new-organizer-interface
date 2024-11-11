import { Component, OnInit } from '@angular/core';
import { DeviceService } from './services/device.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';
  bIsMovileView!: boolean;
  isSidebarOpen = false;

  activeTab: string = 'Dashboard'; // Default active tab
  currentPath: string ='';
  logoUrl: any;
  isDisableLogin: boolean=true;

  setActiveTab(tabTitle: string): void {
    this.activeTab = tabTitle;
    this.isSidebarOpen = false;
  }

  constructor(private deviceService: DeviceService , private router: Router,private sharedService:SharedService) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView=isMobile;
    });
  }

  ngOnInit(): void {
    this.sharedService.businessLogo$.subscribe((logoUrl) => {
      this.logoUrl = logoUrl;
      if(!logoUrl){
        this.logoUrl=this.sharedService.getLogoFromLocalStorage();
      }
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.extractCurrentPath();
      });

    // Call it once immediately to capture the path if not reloading
    this.extractCurrentPath();

    // localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpQWRtaW5JZCI6IjY2YzczM2ZjNmFlMjRkNTM1NDY5NzA4MiIsImVVc2VyVHlwZSI6ImFkbWluIiwiaU9yZ2FuaXphdGlvbklkIjoiNjZjNzMzZmI2YWUyNGQ1MzU0Njk3MDdmIiwiaWF0IjoxNzMxMDU1NjYyfQ.k03dFyEiOWKQH6GiqBu0O3xxMF5n-2G5SMmVP7DKTdE')

  }

  extractCurrentPath(): void {
    const fullPath = this.router.url;
    this.currentPath = fullPath.split('/').pop() || '';
    console.log(this.currentPath);

    if(this.currentPath=='login'){
      this.isDisableLogin=false;
    }else{
      this.isDisableLogin=true;
    }

    if (this.currentPath === 'home' || '') {
      this.activeTab = 'Dashboard';
    } else if (this.currentPath === 'profile') {
      this.activeTab = 'Setting';
    } else if (this.currentPath === 'events') {
      this.activeTab = 'Events';
    }else if (this.currentPath === 'events/_id') {
      this.activeTab = 'View-Events';
    } else if (this.currentPath === 'team') {
      this.activeTab = 'Accounts';
    } else if (this.currentPath === 'get-events') {
      this.activeTab = 'Events';
    }
  }



  // Toggle Sidebar Open State
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logOut(){
    localStorage.removeItem('token')
    this.router.navigateByUrl('login');
  }
}
