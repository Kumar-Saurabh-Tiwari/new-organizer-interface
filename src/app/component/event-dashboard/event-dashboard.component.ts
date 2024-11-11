import { Component } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.scss'
})
export class EventDashboardComponent {
  bIsMovileView: boolean = false;

  eventsArray: any[] = [];
  loading: boolean = false;
  selected!: Date | null;
  imageLoaded = false;
  tokenFromLogin: string = "";
  authToken!: string | null;
  decodeData: any;
  greetingMessage!: string;
  hideValue: boolean = false;

  activeTab: string = 'Upcoming'; // Default active tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (this.activeTab === 'Past') {
      this.eventsArray = this.paginatedPastEvents;
    } else if (this.activeTab === 'Upcoming') {
      console.log(this.activeTab);
      this.eventsArray = this.paginatedUpcomingEvents;
    }
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


  constructor(private deviceService: DeviceService, private apiService: ApiService, private router: Router) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView = isMobile;
    });
  }


  public myAngularxQrCode: string = "null";

  dataAvailableForUpcoming: boolean = true;
  dataAvailableForPast: boolean = true;

  pastEventsArray: any[] = [];
  upcomingEventsArray: any[] = [];

  dataAvailable: boolean = false;
  Eventlength: number = 0;

  currentPageForUpcoming: number = 1;
  currentPageForPast: number = 1;
  itemsPerPage: number = 5;

  // Helper method to generate an array of page numbers for Upcoming Events
  get pagesForUpcoming(): number[] {
    return Array.from({ length: this.totalPagesForUpcoming }, (_, i) => i + 1);
  }

  // Helper method to generate an array of page numbers for Past Events
  get pagesForPast(): number[] {
    return Array.from({ length: this.totalPagesForPast }, (_, i) => i + 1);
  }

  // Calculate total pages for Upcoming and Past events
  get totalPagesForUpcoming(): number {
    return Math.ceil(this.upcomingEventsArray.length / this.itemsPerPage);
  }

  get totalPagesForPast(): number {
    return Math.ceil(this.pastEventsArray.length / this.itemsPerPage);
  }

  // Get paginated data for Upcoming and Past events
  get paginatedUpcomingEvents(): any[] {
    const startIndex = (this.currentPageForUpcoming - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.upcomingEventsArray.slice(startIndex, endIndex);
  }

  get paginatedPastEvents(): any[] {
    const startIndex = (this.currentPageForPast - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.pastEventsArray.slice(startIndex, endIndex);
  }

  // Go to a specific page for Upcoming events
  goToPageForUpcoming(page: number): void {
    if (page >= 1 && page <= this.totalPagesForUpcoming) {
      this.currentPageForUpcoming = page;
      this.eventsArray = this.paginatedUpcomingEvents;
    }
  }

  // Go to a specific page for Past events
  goToPageForPast(page: number): void {
    if (page >= 1 && page <= this.totalPagesForPast) {
      this.currentPageForPast = page;
      this.eventsArray = this.paginatedPastEvents;
    }
  }

  // Previous and Next page controls for Upcoming and Past events
  previousPage(): void {
    if (this.currentPageForUpcoming > 1) {
      this.currentPageForUpcoming--;
      this.eventsArray = this.paginatedUpcomingEvents;
    }
  }

  previousPageForPast(): void {
    if (this.currentPageForPast > 1) {
      this.currentPageForPast--;
      this.eventsArray = this.paginatedPastEvents;
    }
  }

  nextPage(): void {
    if (this.currentPageForUpcoming < this.totalPagesForUpcoming) {
      this.currentPageForUpcoming++;
      this.eventsArray = this.paginatedUpcomingEvents;
    }
  }

  nextPageForPast(): void {
    if (this.currentPageForPast < this.totalPagesForPast) {
      this.currentPageForPast++;
      this.eventsArray = this.paginatedPastEvents;
    }
  }

  events: any[] = [
    { value: "upcoming", viewValue: "Upcoming" },
    { value: "past", viewValue: "Past" },
  ];
  changeToPast() {
    this.activeTab = "past";
  }

  changeToUpcoming() {
    this.activeTab = "upcoming";
  }

  changeToAll() {
    this.activeTab = "all";
  }


  // Arrays to hold the page numbers for upcoming and past events
  // pagesForUpcoming = Array(this.totalPagesForUpcoming).fill(0).map((_, i) => i + 1);
  // pagesForPast = Array(this.totalPagesForPast).fill(0).map((_, i) => i + 1);

  steps: any = [
    // {
    //   element: '#elementId0',
    //   intro: 'Step 1: Welcome to mi-Recall organizer .',
    // },
    {
      element: "#elementId4",
      intro: "Here You get All Events.",
    },
    {
      element: "#elementId5",
      intro: "Here You get Upcoming Events.",
    },
    {
      element: "#elementId6",
      intro: "Here  You get  Past Events.",
    },
    {
      element: "#elementId7",
      intro: "Here You Create New.",
    },
    {
      element: "#elementId8",
      intro: "Here You View Details inside Event.",
    },
    // Add more steps as needed
  ];
  // startTour(): void {
  //   introJs()
  //     .setOptions({
  //       steps: this.steps,
  //     })
  //     .start();
  // }
  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12; // Convert to 12-hour format
    return `${hour}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
  }
  ngOnInit() {
    if (localStorage.getItem("events") == "0") {
      setTimeout(() => {
        // this.startTour();
      }, 3000);

      // setTimeout(()=>{
      // localStorage.setItem("userStat","1");
      // console.log("updated stat!");
      // },500)
    } else {
      console.log("visited user!");
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    this.authToken = localStorage.getItem("token");
    // this.decodeData = jwtDecode(this.authToken as string);

    this.apiService
      .getUpcomingEvents('66c733fb6ae24d535469707f', this.authToken)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.body.upcomingEvents.length > 0) {
            this.upcomingEventsArray = res.body.upcomingEvents;
            // this.urllink = res.body.data.data.sLogo;
            this.Eventlength = this.upcomingEventsArray.length;
            console.log(this.Eventlength);
            console.log(this.upcomingEventsArray);
            this.dataAvailableForUpcoming = false;
          } else {
            this.dataAvailable = false;
            console.log("No Data Available");
          }
        },
        (error) => {
          // Swal.fire("Authentication Failed");
          this.router.navigateByUrl("login");
        }
      );

    this.apiService
      .getPastEvents('66c733fb6ae24d535469707f', this.authToken)
      .subscribe((res) => {
        console.log(res);
        if (res.body.pastEvents.length > 0) {
          this.pastEventsArray = res.body.pastEvents;
          // this.urllink = res.body.data.data.sLogo;
          // this.Eventlength=this.eventsArray.length;
          // console.log(this.Eventlength);
          console.log(this.pastEventsArray);
          this.dataAvailableForPast = false;
        } else {
          this.dataAvailable = false;
        }
      });

    this.setGreetingMessage();

   setTimeout(()=>{
     this.eventsArray = this.paginatedUpcomingEvents;},2000)
  }

  setGreetingMessage() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingMessage = "Good Afternoon";
    } else {
      this.greetingMessage = "Good Evening";
    }
    console.log("Greeting Message:", this.greetingMessage);
  }

  ngOnDestroy(): void {
    if (localStorage.getItem("events") == "0") {
      localStorage.setItem("events", "1");
    }
  }


}
