import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-teams',
  templateUrl: './add-teams.component.html',
  styleUrl: './add-teams.component.scss'
})
export class AddTeamsComponent {
  eventName: string = '';
  organizationName: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  authToken:any=''
  selectedAccessibility:any='';
 note:any={};
  decodeData: any;
  upcomingEventsArray: any[] = [];
  pastEventsArray: any[] = [];
  results: any[] = [];
  Eventlength: any;
  InvitedAccessData:any={
    sEmail:"", iEventIds:[]
  }
  accessArray:any=[];
  addedEventIds:any=[];
  constructor(


    private fb: FormBuilder,
    private apiService:ApiService,
    private router:Router
  ) { }

  inviteForm: FormGroup = new FormGroup({});

  invitedAccess: any = [
    { sName: 'Create Event', value: 'create',check:false },
    { sName: 'Edit Event', value: 'edit',check:false },
    { sName: 'Delete Event', value: 'delete',check:false },
    // {sName:'Select Profile',check:false}
  ]



  ngOnInit(): void {

    this.authToken = localStorage.getItem('token');
    this.decodeData=jwtDecode(this.authToken as string)
    console.log(this.authToken);




    this.apiService
    .getUpcomingEvents(this.decodeData.iOrganizationId, this.authToken)
    .subscribe((res) => {
      if (res.body.upcomingEvents.length > 0) {
        this.upcomingEventsArray = res.body.upcomingEvents;
        console.log(this.upcomingEventsArray);
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
        console.log(this.pastEventsArray);
        this.mergeArrays();
      } else {
        console.log("No Past Data")
      }
    });

    this.inviteForm = this.fb.group({
      organizationId:[''],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      type: ['staff'],
      accessType:[[]]
    });
  }
  mergeArrays() {
    // Check if all arrays have been populated
    if (this.pastEventsArray.length > 0 || this.upcomingEventsArray.length > 0) {
      this.results = [...this.pastEventsArray, ...this.upcomingEventsArray];
  
      console.log(this.results);
    }
  
    // Create 'dataPresent' property for each element if it doesn't exist
    // this.results.forEach(result => {
    //   if (!result.hasOwnProperty('dataPresent')) {
    //     result.dataPresent = false; 
    //   }
    // });
  }
  addAllData(){
  const allEvents = this.results.map(item => item._id);
// const upcomingIds = this.pastEventsArray.map(item => item._id);
console.log(allEvents);
// Concatenate the arrays to create a new array containing all _id values
this.InvitedAccessData.iEventIds = [...allEvents];
// Swal.fire("All Events Are Added!")
console.log(this.InvitedAccessData.iEventIds);
  }

  isEventInvited(eventId: string): boolean {
    // Implement your logic to check if the event is invited
    return this.InvitedAccessData.iEventIds.includes(eventId);
  }

  onAccessChange(checked: boolean, event: string){


    if (checked) {
      this.inviteForm.value.accessType.push(event);

      console.log(this.inviteForm.value);
    } else {
      this.removeItemByName(event);
    }
  }

  onCheckboxChange(checked: boolean, eventId: string): void {
console.log(checked)
    if (checked) {
      // Add event to invited user
      console.log('Add Check box ',eventId);
      this.addEventToInvitedUser(eventId);
    } else {
      console.log('Removed Check box ',eventId);
      // Remove event from invited user
      this.removeItem(eventId);
    }
  }
  
  onCheckboxChangeEvent(event: Event, eventId: string) {
    const checkbox = event.target as HTMLInputElement; // Cast to HTMLInputElement
    this.onCheckboxChange(checkbox.checked, eventId);
  }
  onAccessChangeEvent(event: Event, eventId: string) {
    const checkbox = event.target as HTMLInputElement; // Cast to HTMLInputElement
    this.onAccessChange(checkbox.checked, eventId);
  }

  // hasObjectId(id: string): boolean {
  //   return this.eventAccessArray.some((obj: { _id: string; }) => obj._id === id);
  // }

  addEventToInvitedUser(Id: any) {

    // if (this.hasObjectId(Id)) {
    //   Swal.fire("Event Already Exist!")
    // } else {

      if (this.InvitedAccessData.iEventIds.includes(Id)) {
        // Swal.fire("Event Already Exist!")

      } else {
        // Swal.fire("Event Added!")
        this.InvitedAccessData.iEventIds.push(Id);
        // this.EventIdsArray.iEventIds.push(eventName);
        console.log(this.InvitedAccessData.iEventIds)

      }
    

  }

  removeItem(eventId: any): void {

    const index = this.InvitedAccessData.iEventIds.indexOf(eventId);
    console.log('current Index : ', index)

    if (index !== -1) {
        this.InvitedAccessData.iEventIds.splice(index, 1);
    }
    console.log(this.InvitedAccessData)
  }

  removeItemByName(accessName: any): void {

    const index =  this.inviteForm.value.accessType.indexOf(accessName);
    console.log('current Index : ', index)

    if (index !== -1) {
      this.inviteForm.value.accessType.splice(index, 1);
      console.log(this.inviteForm.value);
    }
    // this.InvitedAccessData.iEventIds.splice(index, 1);
    // console.log(this.InvitedAccessData)
  }

  submitForm(): void {
    this.inviteForm.value.organizationId=this.decodeData.iOrganizationId;
    console.log('Form Fields:', this.inviteForm.value);
    this.authToken = localStorage.getItem('token');
    this.InvitedAccessData.sEmail= this.inviteForm.value.email;

    this.apiService.inviteUser(this.inviteForm.value, this.authToken).subscribe(
      (response) => {
        console.log('Form submitted:', response);
        this.submitAccessData();
        Swal.fire('Invite Send Success!')

      
      },
      (error) => {
        console.error('Error submitting form:', error);
        Swal.fire('User Already Exists!')
      }
    );
  }

  submitAccessData(){
    console.log(this.InvitedAccessData);
    this.apiService.eventAccessToUser(this.InvitedAccessData, this.authToken).subscribe(
      (response) => {
        console.log('Access Form submitted:', response);
      
        this.router.navigateByUrl('user-profile');

      },
      (error) => {
        console.error('Access Error submitting form:', error);
      }
    );
  }
}
