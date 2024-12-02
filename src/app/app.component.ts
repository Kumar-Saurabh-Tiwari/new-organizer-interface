import { Component, OnInit } from '@angular/core';
import { DeviceService } from './services/device.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SharedService } from './services/shared.service';
import Swal from 'sweetalert2';

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
  currentPath: string = '';
  logoUrl: any;
  isDisableLogin: boolean = true;

  setActiveTab(tabTitle: string): void {
    this.activeTab = tabTitle;
    this.isSidebarOpen = false;
  }

  constructor(private deviceService: DeviceService, private router: Router, private sharedService: SharedService) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView = isMobile;
    });
  }

  ngOnInit(): void {
    this.sharedService.businessLogo$.subscribe((logoUrl) => {
      this.logoUrl = logoUrl;
      if (!logoUrl) {
        this.logoUrl = this.sharedService.getLogoFromLocalStorage();
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

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const fullPath = event.urlAfterRedirects;
        const segments = fullPath.split('/');
        this.currentPath = segments.slice(-2).join('/'); // Get the last two segments
        console.log(this.currentPath);

        // Match for "verify/<id>" dynamically
        if (segments[segments.length - 2] === 'verify' && segments[segments.length - 1].length === 24) {
          this.isDisableLogin = false;
        } else if (this.currentPath === '/login' || this.currentPath==='/onboarding') {
          this.isDisableLogin = false;
        } else {
          this.isDisableLogin = true;
        }

        // Active Tab Logic
        if (this.currentPath === 'home' || this.currentPath === '') {
          this.activeTab = 'Dashboard';
        } else if (this.currentPath === 'profile') {
          this.activeTab = 'Setting';
        } else if (this.currentPath === 'events') {
          this.activeTab = 'Events';
        } else if (this.currentPath.startsWith('events/') && this.currentPath.split('/').length === 2) {
          this.activeTab = 'View-Events';
        } else if (this.currentPath === 'team') {
          this.activeTab = 'Teams';
        } else if (this.currentPath === 'get-events') {
          this.activeTab = 'Events';
        }
      }
    });

  }

  extractCurrentPath(): void {
    const fullPath = this.router.url;
    // this.currentPath = fullPath.split('/').pop() || '';
    // console.log(this.currentPath);


  }



  // Toggle Sidebar Open State
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logOut() {
    Swal.fire({
      title: "Are you sure want to LogOut!",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `No!`
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        sessionStorage.clear();

        // localStorage.removeItem('token')
        // this.router.navigateByUrl('login');

        Swal.fire("LogOut Success!", "", "success");
        this.router.navigateByUrl('/login');

      } else if (result.isDenied) {
        Swal.fire("Return to Dashboard", "", "info");
      }
    });
  }

}
