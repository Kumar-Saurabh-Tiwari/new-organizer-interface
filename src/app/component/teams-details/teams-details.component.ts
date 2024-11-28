import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teams-details',
  templateUrl: './teams-details.component.html',
  styleUrl: './teams-details.component.scss'
})
export class TeamsDetailsComponent {

  eventObject: any = {};
  authToken: string;
  decodeData: any;
  itemId: string;
  currentId: string;
  organizationStatus: any = {};
  upcomingEventsArray: any[] = [];
  pastEventsArray: any[] = [];
  results: any[] = [];

  InvitedAccessData: any = {
    sEmail: "", iEventIds: []
  }
  EventIdsArray: any = {
    iEventIds: []
  };

  showEvents: boolean = false;
  eventAccessArray: any;
  constructor(private sharedService: SharedService, private apiService: ApiService, private activateRoute: ActivatedRoute, private router: Router) {
  }

  giveEventAccess() {
    this.showEvents = true;
  }

  ngOnInit(): void {

    this.authToken = localStorage.getItem('token');
    this.decodeData = jwtDecode(this.authToken as string);

    this.apiService
      .getUpcomingEvents(this.decodeData.iOrganizationId, this.authToken)
      .subscribe((res) => {
        if (res.body.upcomingEvents.length > 0) {
          this.upcomingEventsArray = res.body.upcomingEvents;
          this.mergeArrays();

        } else {
          console.log("No Upcoming Data")
        }
      });

    this.apiService
      .getPastEvents(this.decodeData.iOrganizationId, this.authToken)
      .subscribe((res) => {
        if (res.body.pastEvents.length > 0) {
          this.pastEventsArray = res.body.pastEvents;
          this.mergeArrays();
        } else {
          console.log("No Past Data")
        }
      });

    this.activateRoute.paramMap.subscribe(params => {
      this.itemId = params.get('_id') ?? '';
      this.currentId = params.get('_id') ?? '';
      // console.log("Current Id " + this.currentId);
      this.apiService.getSelectedUserData(this.itemId, this.authToken).subscribe((data) => {
        this.eventObject = data.body.data;
        console.log(this.eventObject)
        this.InvitedAccessData.sEmail = this.eventObject.sEmail;
        // this.myArray = Object.entries(this.eventObject); 
        // console.log(this.myArray)   
      });
      this.apiService.getSelectedUserAccessData(this.itemId, this.authToken).subscribe((data) => {
        this.eventAccessArray = data.body.data.events;
        this.eventAccessArray.filter(res => {
          this.InvitedAccessData.iEventIds.push(res._id)
        })
        // this.InvitedAccessData.iEventIds=[...this.eventAccessArray];
        console.log(this.InvitedAccessData.iEventIds)

        this.mergeArrays();
        // this.myArray = Object.entries(this.eventObject); 
        // console.log(this.myArray)   
      });
    });
    this.getOrganizationStatus();
    this.initializeComponent();
  }

  mergeArrays() {
    // Check if all arrays have been populated
    if (this.pastEventsArray.length > 0 || this.upcomingEventsArray.length > 0 || this.eventAccessArray) {
      this.results = [...this.pastEventsArray, ...this.upcomingEventsArray];

      // Iterate over each element in the results array
      this.results.forEach(result => {
        // Check if the result ID exists in the eventAccessArray
        if (this.eventAccessArray.some) { // Check if some method is available
          result.dataPresent = this.eventAccessArray.some((item: { _id: any; }) => item._id === result._id);
        } else {
          console.error("eventAccessArray is not iterable.");
        }
      });

      console.log(this.results);
    }

    // Create 'dataPresent' property for each element if it doesn't exist
    this.results.forEach(result => {
      if (!result.hasOwnProperty('dataPresent')) {
        result.dataPresent = false; // Set default value
      }
    });
  }

  selectedValue: boolean = false;
  initializeComponent() {

    this.results.forEach(result => {
      // Check if the result ID exists in the eventAccessArray
      if (this.eventAccessArray.some((item: { _id: any; }) => item._id === result._id)) {
        // If it exists, mark the result as selected
        this.selectedValue = true;
        console.log(this.selectedValue);

      } else {
        // If it doesn't exist, mark the result as not selected
        this.selectedValue = false;
        console.log(this.selectedValue);

      }
    });
  }
  isEventInvited(eventId: string): boolean {
    // Implement your logic to check if the event is invited
    return this.InvitedAccessData.iEventIds.includes(eventId);
  }

  onCheckboxChange(event: Event, eventId: string, eventName: string): void {
    const checked = (event.target as HTMLInputElement).checked; // Cast to HTMLInputElement to access 'checked'
    
    if (checked) {
      console.log('Add Check box ', eventId);
      this.addEventToInvitedUser(eventId, eventName);
    } else {
      console.log('Check box ', eventId);
      this.removeItem(eventId);
    }
  }
  
  onCheckboxChange2(event: Event, eventName: string): void {
    const checked = (event.target as HTMLInputElement).checked; // Cast to HTMLInputElement to access 'checked'
  
    if (checked) {
      this.eventObject.aAccessType.push(eventName);
      console.log('Add Check box ', this.eventObject);
    } else {
      const index = this.eventObject.aAccessType.indexOf(eventName);
  
      if (index !== -1) {
        this.eventObject.aAccessType.splice(index, 1);
        console.log(this.eventObject);
      }
    }
  }
  
  invitedAccess: any = [
    { sName: 'Create Event', value: 'create' },
    { sName: 'Edit Event', value: 'edit' },
    { sName: 'Delete Event', value: 'delete' },
    // {sName:'Select Profile',check:false}
  ]
  checkIsPresent(eventName: string) {
    return this.eventObject?.aAccessType?.includes(eventName)
  }


  hasObjectId(id: string): boolean {
    return this.eventAccessArray.some((obj: { _id: string; }) => obj._id === id);
  }

  addEventToInvitedUser(Id: any, eventName: string) {

      // if (this.InvitedAccessData.iEventIds.includes(Id)) {

      // } else {
        // Swal.fire("Event Added!")
        this.InvitedAccessData.iEventIds.push(Id);
        // this.EventIdsArray.iEventIds.push(eventName);
        console.log(this.InvitedAccessData)

      
    

  }

  removeItem(eventId: any): void {

    const index = this.InvitedAccessData.iEventIds.indexOf(eventId);

    if (index !== -1) {
      this.InvitedAccessData.iEventIds.splice(index, 1);
    }
    // this.InvitedAccessData.iEventIds.splice(index, 1);
    console.log(this.InvitedAccessData)
  }


  submitAccessData() {
    console.log(this.InvitedAccessData);
    this.apiService.eventAccessToUser(this.InvitedAccessData, this.authToken).subscribe(
      (response) => {
        console.log('Access Form submitted:', response);

      },
      (error) => {
        console.error('Access Error submitting form:', error);
      }
    );
  }

  deleteEvent() {
    Swal.fire({
      title: "Are you sure to delete event?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.RemoveUserAccess(this.itemId, this.authToken).subscribe((data) => {
          console.log(data)
          console.log('Delete event clicked');
        });
        Swal.fire({
          title: "Deleted!",
          text: "User Removed from Team.",
          icon: "success"
        });
        setTimeout(() => {
          this.router.navigateByUrl('user-profile');
        }, 2000);
      }
    });
  }

  updateEvent() {
    Swal.fire({
      title: "Are you sure to update event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateUser(this.itemId, this.eventObject, this.authToken).subscribe((data) => {
          console.log(data)
          this.submitAccessData();
          Swal.fire({
            title: "Updated!",
            text: "User Updated Success.",
            icon: "success"
          });

          setTimeout(() => {
            this.router.navigateByUrl('user-profile');
          }, 2000);

        },
          (error) => {
            Swal.fire({
              title: "Failed!",
              text: "User Not Updated.",
              icon: "warning"
            });          }
        );


      }
    });
  }

  getOrganizationStatus() {
    this.apiService.getOrganizationStatus(this.currentId, this.authToken).subscribe((res) => {

      this.organizationStatus = res.body.data;
      console.log(this.organizationStatus);
    })
  }

  data: any = {};
  toggleEvent() {
    this.apiService.ToggleStatusPost(this.data, this.currentId, this.authToken).subscribe(res => {
      console.log(res)
    })
  }
}
