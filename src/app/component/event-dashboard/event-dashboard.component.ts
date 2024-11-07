import { Component } from '@angular/core';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.scss'
})
export class EventDashboardComponent {
  bIsMovileView: boolean = false;

  activeTab: string = 'All Transactions'; // Default active tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

    transactions = [
    {
      name: "Spotify Subscription",
      id: "#12548796",
      category: "Shopping",
      card: "1234 ****",
      date: "28 Jan, 12.30 AM",
      amount: -2500,
      type: "negative",
      downloadLabel: "Download",
    },
    {
      name: "Freepik Sales",
      id: "#12548796",
      category: "Transfer",
      card: "1234 ****",
      date: "25 Jan, 10.40 PM",
      amount: 750,
      type: "positive",
      downloadLabel: "Download",
    },
    {
      name: "Mobile Service",
      id: "#12548796",
      category: "Service",
      card: "1234 ****",
      date: "20 Jan, 10.40 PM",
      amount: -150,
      type: "negative",
      downloadLabel: "Download",
    },
    {
      name: "Wilson",
      id: "#12548796",
      category: "Transfer",
      card: "1234 ****",
      date: "15 Jan, 03.29 PM",
      amount: -1050,
      type: "negative",
      downloadLabel: "Download",
    },
    {
      name: "Emily",
      id: "#12548796",
      category: "Transfer",
      card: "1234 ****",
      date: "14 Jan, 10.40 PM",
      amount: 840,
      type: "positive",
      downloadLabel: "Download",
    },
  ];


  constructor(private deviceService: DeviceService) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView = isMobile;
    });
  }
}
