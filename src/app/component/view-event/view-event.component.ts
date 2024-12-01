import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MapService } from '../../services/map.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss'
})
export class ViewEventComponent {

  private locationSubscription: Subscription;
  mapEnable:boolean=false;

  loading: boolean = false;
  locationControl = new FormControl();
  locations: any[] = [];

  authToken!: string | null;
  decodeData: any;
  eventFields: any[] = [];
  eventObject:any= {
    sName: '',
    sDescription: '',
    sLocationDigital: '',
    sCostDescription: '',
    sLocationPhysical: '',
    sStartTime: '',
    sEndTime: '',
    dStartDate: '',
    dEndDate: '',
    dRegistrationOpens: '',
    dRegistrationCloses: '',
    locCoordinates: {coordinates:[]}
  };
  myArray :  any[] = [];
  currentId:any='';

  eventForm!: FormGroup;
  fadeInAnimation = 'fadeIn'; // Animation trigger
  itemId: any;
  uploadImg!: boolean;
  mapData: any;
  selectedLocation: any;
  locationData:any={type:'Point',coordinates:[]}

  @ViewChild('fileInput') fileInput!: ElementRef;

  onEditIconClick() {
    // Open file input when the edit icon is clicked
    this.fileInput.nativeElement.click();
  }
  
  sendEventIdToPath(): void {
    const generatedId = this.currentId;
    // this.sharedService.eventId(generatedId);
  }

  
  openMap(){
    this.mapEnable=true;
  }

  setLocation(location: { lat: number; lng: number; address: string }) {
    this.eventForm.get('sLocationPhysical')?.setValue(location.address);
    this.mapEnable = false;
    console.log('Selected Location:', location); // For debugging
  }
  closeMap(cancelled: any) {
    console.log('Map selection cancelled:', cancelled);
    this.mapEnable = false;
  }


  constructor( private apiService:ApiService, private activateRoute: ActivatedRoute,private router:Router, private datePipe: DatePipe, private mapServices:MapService){
    this.locationSubscription = this.locationControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.mapServices.searchLocation(value))
    ).subscribe((data: any) => {
      this.locations = data;
    });
  }
  clearResult(){
    this.locationControl.setValue('')
    this.locations=[];
  }
    ngOnInit(): void {
      // this.locations=[];
      this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 2000);

      this.authToken = localStorage.getItem('token');
      this.decodeData=jwtDecode(this.authToken as string);
    
      this.activateRoute.paramMap.subscribe(params => {
       this.itemId = params.get('_id') ??'';
       this.currentId = params.get('_id') ??'';
        // console.log("Current Id " + this.currentId);
        this.apiService.getEventsFields(this.itemId,this.authToken).subscribe((data) => {
          console.log(data.body.event)
          this.eventObject = data.body.event;  
          // console.log(this.eventObject.locCoordinates.coordinates)  
          if(this.eventObject.locCoordinates.coordinates[0] != 0,this.eventObject.locCoordinates.coordinates[1]!= 0){
            this.getMapData(this.eventObject.locCoordinates.coordinates[0],this.eventObject.locCoordinates.coordinates[1]);
          }

          this.eventObject.dStartDate = this.formatDate(this.eventObject.dStartDate,this.eventObject.sStartTime);
          this.eventObject.dEndDate = this.formatDate(this.eventObject.dEndDate,this.eventObject.sEndTime);



          // this.eventObject.dRegistrationOpens = this.formatDate(this.eventObject.dRegistrationOpens);
          // this.eventObject.dRegistrationCloses = this.formatDate(this.eventObject.dRegistrationCloses);

  
        });
      });

  
    }

    selectLocation(location: any) {
      console.log(this.locationControl.value);
      this.selectedLocation = location;
      this.locationControl.setValue(location.display_name);
  
      // this.locationData.type=location.type;
      this.eventObject.locCoordinates.coordinates=[];
      this.eventObject.locCoordinates.coordinates.push(location.lat)
      this.eventObject.locCoordinates.coordinates.push(location.lon)

      // this.locationData.coordinates.push(location.lat)
      // this.locationData.coordinates.push(location.lon)
            console.log(this.eventObject);

      console.log('Selected Location:', this.selectedLocation);
      // this.locationSubscription.unsubscribe(); 
      this.locations=[];
      setTimeout(()=>{
        this.locations=[];
      },700)
  
    }

    getMapData(coordinate1:any,coordinate2:any){
      console.log(coordinate1,coordinate2);
      this.mapServices.getLocation
      (coordinate1,coordinate2).subscribe((res)=>{
        this.mapData=res;
        console.log(this.mapData.display_name);
        this.locationControl.setValue(this.mapData.display_name);

      })
    }
   
          formatDate(dateString: any, timeString: any) {
            const date = new Date(dateString);
            
            // Split timeString to extract hours and minutes
            const [hours, minutes] = timeString.split(':');
          
            // Set the time using the provided timeString
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
          
            // Format the date components
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            const formattedHours = ("0" + date.getHours()).slice(-2);
            const formattedMinutes = ("0" + date.getMinutes()).slice(-2);
          
            return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`;
          }
          

          reverseFormatDate(dateString: any) {
            if (!dateString || typeof dateString !== 'string' || !dateString.includes('T')) {
              console.error('Invalid date string format');
              return null;
            }
          
            // Split the date and time parts
            const parts = dateString.split('T');
            const datePart = parts[0];
            const timePart = parts[1];
          
            // Split the date part into year, month, day
            const dateParts = datePart.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
          
            // Split the time part into hours, minutes
            const timeParts = timePart.split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
          
            // Create a new Date object in UTC
            const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
          
            // Format the date to ISO string and remove 'Z'
            const formattedDate = utcDate.toISOString().replace('Z', '');
          
            return formattedDate;
          }
          
  
    formatToDesiredFormat(dateString: string): string {
  const date = new Date(dateString);
  return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSSZ')!;
}
selectFiles(event: any) {
  if (event.target.files) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.eventObject.sLogo = event.target.result;
      this.uploadImg=true;
      console.log("true")
    };
  }
}

DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++)
    ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

submitData() {
  
  const date1 = new Date(this.eventObject.dStartDate);
  const hours1 = ("0" + date1.getHours()).slice(-2);
  const minutes1 = ("0" + date1.getMinutes()).slice(-2);
  
  const startTimeString = `${hours1}:${minutes1}`;
   this.eventObject.sStartTime=startTimeString;


  const date = new Date(this.eventObject.dEndDate);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  
  const endTimeString = `${hours}:${minutes}`;
   this.eventObject.sEndTime=endTimeString;
  // this.eventObject.dStartDate = this.reverseFormatDate(this.eventObject.dStartDate);
  // this.eventObject.dEndDate = this.reverseFormatDate(this.eventObject.dEndDate);
  // this.eventObject.dRegistrationOpens = this.reverseFormatDate(this.eventObject.dRegistrationOpens);
  // this.eventObject.dRegistrationCloses = this.reverseFormatDate(this.eventObject.dRegistrationCloses);

  // this.eventObject.dStartDate=this.formatToDesiredFormat(this.eventObject.dStartDate);
  // this.eventObject.dEndDate = this.formatToDesiredFormat(this.eventObject.dEndDate);
  // this.eventObject.dRegistrationOpens = this.formatToDesiredFormat(this.eventObject.dRegistrationOpens);
  // this.eventObject.dRegistrationCloses = this.formatToDesiredFormat(this.eventObject.dRegistrationCloses);
  console.log(this.eventObject);

  const file = this.DataURIToBlob(this.eventObject.sLogo);
  const formData = new FormData();

  if(this.uploadImg){
    formData.append("sLogo", file, "image.jpg");
  }else{
    formData.append("sLogo",this.eventObject.sLogo);
  }
  //  formData.append('iOrganizationId', this.decodeData.iOrganizationId);
  //  formData.append('userId', this.decodeData.iAdminId);
   formData.append('sName', this.eventObject.sName);
   formData.append('sDescription', this.eventObject.sDescription);
   formData.append('locCoordinates',  this.eventObject.locCoordinates);
   formData.append('sLocationDigital', this.eventObject.sLocationDigital);
   formData.append('sLocationPhysical', this.eventObject.sLocationPhysical);
   formData.append('dRegistrationCloses', this.eventObject.dRegistrationCloses);
   formData.append('dRegistrationOpens', this.eventObject.dRegistrationOpens);
   formData.append('sEndTime', this.eventObject.sEndTime);
   formData.append('dEndDate', this.formatToDesiredFormat(this.eventObject.dEndDate));
   formData.append('sStartTime', this.eventObject.sStartTime);
   formData.append('dStartDate', this.formatToDesiredFormat(this.eventObject.dStartDate));
   formData.append('bIsPublic', this.eventObject.bIsPublic);
   formData.append('sCostDescription', this.eventObject.sCostDescription);
   formData.append('sDressCode', this.eventObject.sDressCode);


  console.log("Sending data to the backend:", formData);

      // console.log(this.eventObject.dStartDate);
      Swal.fire({
        title: "Do you want to save the changes in Event?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.UpdateEvent(this.itemId, this.eventObject,this.authToken).subscribe((data) => {
            console.log(data)
            console.log('Update event clicked'); 

            Swal.fire("Event Updated!", "", "success");
            setTimeout(() => {
              this.router.navigateByUrl('');         
             }, 2000);

          },(error)=>{
            Swal.fire({
              title: "Failed!",
              text: "You not have access to Update.",
              icon: "warning"
            });          
          }
          );
 
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
}

    updateEvent() {
      this.eventObject.dStartDate = this.reverseFormatDate(this.eventObject.dStartDate);
      this.eventObject.dEndDate = this.reverseFormatDate(this.eventObject.dEndDate);
      this.eventObject.dRegistrationOpens = this.reverseFormatDate(this.eventObject.dRegistrationOpens);
      this.eventObject.dRegistrationCloses = this.reverseFormatDate(this.eventObject.dRegistrationCloses);

      this.eventObject.dStartDate=this.formatToDesiredFormat(this.eventObject.dStartDate);
      this.eventObject.dEndDate = this.formatToDesiredFormat(this.eventObject.dEndDate);
      this.eventObject.dRegistrationOpens = this.formatToDesiredFormat(this.eventObject.dRegistrationOpens);
      this.eventObject.dRegistrationCloses = this.formatToDesiredFormat(this.eventObject.dRegistrationCloses);

  
      console.log(this.eventObject.dStartDate);
      Swal.fire({
        title: "Do you want to save the changes in Event?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.UpdateEvent(this.itemId, this.eventObject,this.authToken).subscribe((data) => {
            console.log(data)
            console.log('Update event clicked'); 

            Swal.fire("Event Updated!", "", "success");
            setTimeout(() => {
              this.router.navigateByUrl('');         
             }, 2000);

          },(error)=>{
            Swal.fire({
              title: "Failed!",
              text: "You not have access to Update.",
              icon: "warning"
            });          
          }
          );
 
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
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
          this.apiService.DeleteEvent(this.itemId,this.authToken).subscribe((data) => {
            console.log(data)
            console.log('Delete event clicked');
            Swal.fire({
              title: "Deleted!",
              text: "Your Event has been Deleted.",
              icon: "success"
            });
            setTimeout(() => {
              this.router.navigateByUrl('');         
             }, 2000);
          },(error)=>{
            Swal.fire({
              title: "Failed!",
              text: "You not have access to Deleted.",
              icon: "warning"
            });
          }
          ); 
   
        }
      });
    }

    onSubmit(){
      setTimeout(() => {
        this.router.navigateByUrl(`/eventJoinQR?eventId=${this.currentId}&eventname=${this.eventObject.sName}`);         
       }, 1000);
    }

}
