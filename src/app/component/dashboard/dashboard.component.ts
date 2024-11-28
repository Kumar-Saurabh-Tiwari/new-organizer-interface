import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @ViewChildren('tooltipTarget') tooltipTargets!: QueryList<ElementRef>;
  // @ViewChildren(NgbTooltip) tooltips!: QueryList<NgbTooltip>;

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12; // Convert to 12-hour format
    return `${hour}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
  }
steps:any = [
  {
    element: '#elementId0',
    intro: 'Welcome to mi-Recall organizer .',
  },
    {
      element: '#elementId1',
      intro: 'Here You Create New Events.',
    },
    {
      element: '#elementId2',
      intro: 'Here view all Upcoming Events.',
    },
    {
      element: '#elementId3',
      intro: 'Here view all Past Events.',
    },
    // Add more steps as needed
  ];
  

  loading: boolean = false;


  selected!: Date | null;
  tokenFromLogin: string='';
  authToken!: string | null;
  decodeData: any;
  greetingMessage!: string;
  hideValue:boolean=false;
  selectedContainer: string = 'upcoming';
  public myAngularxQrCode: string = 'null';
  constructor(private apiService:ApiService, private router:Router,private spinner: NgxSpinnerService) {}

  pastEventsArray: any[] = [];
  upcomingEventsArray:any[]=[];

  dataAvailableForUpcoming: boolean =true;
  dataAvailableForPast:boolean=true;
 Eventlength:number=0;

 currentPageForUpcoming: number = 1;
 currentPageForPast:number=1
 itemsPerPage: number = 5;
 
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
 
 previousPage(): void {
   if (this.currentPageForUpcoming > 1) {
     this.currentPageForUpcoming--;
   }
 }

 previousPageForPast(): void {
  if (this.currentPageForPast > 1) {
    this.currentPageForPast--;
  }
}
 
 nextPage(): void {
   const totalPages = Math.ceil(this.upcomingEventsArray.length / this.itemsPerPage);
   if (this.currentPageForUpcoming < totalPages) {
     this.currentPageForUpcoming++;
   }
 }

 nextPageForPast(): void {
  const totalPages = Math.ceil(this.pastEventsArray.length / this.itemsPerPage);
  if (this.currentPageForPast < totalPages) {
    this.currentPageForPast++;
  }
}

events: any[] = [
  {value: 'upcoming', viewValue: 'Upcoming'},
  {value: 'past', viewValue: 'Past'},
];
changeVisibility(){
  if(this.hideValue=false){
    this.hideValue=true;
  }
  else{
    this.hideValue=false
  }
 
}
tooltipShown = false;

// startTour(): void {
//   introJs().setOptions({
//     steps: this.steps,
//   }).start();
// }

  ngOnInit() {
    // this.filteredData();
    if(localStorage.getItem("userStat")=="0"){
      // setTimeout(()=>{
      //   this.startTour();
      // },3000) ;  

      console.log(localStorage.getItem("userStat"));

      // setTimeout(()=>{
      // localStorage.setItem("userStat","1");
      // console.log("updated stat!");
      // },500)
    }else{
      console.log("visited user!");
    }
     

      this.authToken = localStorage.getItem('token');
      this.decodeData=jwtDecode(this.authToken as string)
     
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
      this.spinner.show();
      this.apiService.getUpcomingEvents(this.decodeData.iOrganizationId,this.authToken).subscribe((res) => {
        console.log(res.body.data);
        if( res.body.upcomingEvents.length>0){
          this.upcomingEventsArray = res.body.upcomingEvents;
          this.dataAvailableForUpcoming=false
        }
        else{
         console.log("No Data Available");
        } 
        this.spinner.hide();
    },
    (error)=>{
      this.spinner.hide();
      //  Swal.fire("Authentication Failed")
      //  this.router.navigateByUrl('login')
    }
    );

    this.spinner.show();
    this.apiService.getPastEvents(this.decodeData.iOrganizationId,this.authToken).subscribe((res) => {
      console.log(res);
      if( res.body.pastEvents.length >0){
        this.pastEventsArray = res.body.pastEvents;
        this.dataAvailableForPast=false
      }
      else{
        console.log("No Data Available");
      }
      this.spinner.hide();
  },(err)=>{
    this.spinner.hide();
  }
  );
    this.setGreetingMessage();
  }




  setGreetingMessage() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingMessage = 'Good Afternoon';
    } else {
      this.greetingMessage = 'Good Evening';
    }
    console.log('Greeting Message:', this.greetingMessage);
  }
  

  ngOnDestroy(): void {
    if(localStorage.getItem("userStat")=="0"){


      localStorage.setItem("userStat","1");
    } 
  }
}
