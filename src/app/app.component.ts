import { Component, OnInit } from '@angular/core';
import { DeviceService } from './services/device.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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

  setActiveTab(tabTitle: string): void {
    this.activeTab = tabTitle;
    this.isSidebarOpen = false;
  }

  constructor(private deviceService: DeviceService , private router: Router ,private route: ActivatedRoute) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView=isMobile;
    });
  }

  ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.extractCurrentPath();
      });

    // Call it once immediately to capture the path if not reloading
    this.extractCurrentPath();

  }

  extractCurrentPath(): void {
    const fullPath = this.router.url;
    this.currentPath = fullPath.split('/').pop() || '';

    if (this.currentPath === 'home' || '') {
      this.activeTab = 'Dashboard';
    } else if (this.currentPath === 'profile') {
      this.activeTab = 'Setting';
    } else if (this.currentPath === 'events') {
      this.activeTab = 'Transactions';
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
}
