// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-create-event',
//   templateUrl: './create-event.component.html',
//   styleUrls: ['./create-event.component.scss']
// })
// export class CreateEventComponent implements OnInit {
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   imageUrl: any;

//   onLogoChange(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//        const reader = new FileReader();
//       reader.onload = (e: any) => {
//           this.imageUrl= e.target.result
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   onEditIconClick() {
//      this.fileInput.nativeElement.click();
//   }

//   eventForm!: FormGroup;
//   currentStep = 1;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.initializeForm();
//   }

//    initializeForm(): void {
//     this.eventForm = this.fb.group({
//       iOrganizationId: [''],
//       userId: [''],
//       sName: ['', Validators.required],
//       sLogo: [''], 
//       sDescription: ['', Validators.required],
//       dStartDate: [null, Validators.required],  
//       sStartTime: ['11:00'], 
//       dEndDate: [null, Validators.required], 
//       sEndTime: ['18:00'],
//       dRegistrationOpens: [''],
//       dRegistrationCloses: [''],
//       sLocationPhysical: [''],
//       sLocationDigital: [''],
//       sLocationAddress: [''],
//       locCoordinates: this.fb.group({
//         type: ['Point'],
//         coordinates: [[0, 0]]
//       }),
//       sLocationDescription: [''],
//       sCostDescription: [''],
//       bAgeRestricted: [false],
//       bIsPublic: [false],
//       sDressCode: [''],
//       bAllowRegistration: [true],
//       sEventStatus: ['Open'],
//     });
//   }

//    nextStep(): void {
//     if (this.currentStep < 3) {
//       this.currentStep++;
//     }
//   }

//    prevStep(): void {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//    submitForm(): void {
//     console.log(this.eventForm.value);
//   }

//    isLastStep(): boolean {
//     return this.currentStep === 3;
//   }
// }

import { Component, ElementRef, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
// import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  @ViewChild('information') private information!: TemplateRef<CreateEventComponent>;
  // private modalRef: NgbModalRef;
  // @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  @ViewChild('content') private content!: TemplateRef<CreateEventComponent>;
  // map: google.maps.Map;
  private locationSubscription: Subscription;

  onEditIconClick() {
    this.fileInput.nativeElement.click();
  }

  loading: boolean = false;
  infoMessage: boolean = false;
  infoMessage1: boolean = false;
  infoMessage2: boolean = false;
  infoMessage3: boolean = false;
  infoMessage4: boolean = false;
  infoMessage5: boolean = false;
  infoMessage6: boolean = false;
  infoMessage7: boolean = false;
  infoMessage8: boolean = false;
  infoMessage9: boolean = false;
  infoMessage10: boolean = false;
  infoMessage11: boolean = false;
  infoMessage12: boolean = false;
  infoMessage13: boolean = false;
  infoMessage14: boolean = false;
  infoMessage15: boolean = false;

  eventStartDateTime: any = ''
  eventEndDateTime: any = ''


  eventForm!: FormGroup;
  authToken!: string | null;

  public favoriteColor = '#26ab3c';
  decodeData: any;
  currentStep = 1;

  isMapMode: boolean = false;
  location: string = '';
  zoom = 12;
  lat = 0;
  lng = 0;
  latitude = 0;
  longitude = 0;
  // @ViewChild(GoogleMap) googleMap: GoogleMap;
  // @ViewChild(MapMarker) mapMarker: MapMarker;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  // marker: google.maps.Marker;
  // map!: google.maps.Map;

  locationControl = new FormControl();
  locations: any[] = [];
  selectedLocation: any;
  step = 1; // Current step
  eventVisibility!: boolean;
  isMobileScreen!: boolean;
  searchQuery!: string;
  modelInfo: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private zone: NgZone,
    private mapService: MapService,
    // private modalService: NgbModal,
    public dialog: MatDialog

  ) {

    this.locationSubscription = this.locationControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.mapService.searchLocation(value))
    ).subscribe((data: any) => {
      this.locations = data;
    });
    this.initializeForm();
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      iOrganizationId: [''],
      userId: [''],
      sName: ['', Validators.required],
      sImage: [''],
      sLogo: [''],// image logo url
      sDescription: [''],
      dStartDate: [null, Validators.required], // type date
      sStartTime: ['11:00'], // type time
      dEndDate: [null, Validators.required], // type t
      sEndTime: ['18:00'], // time
      dRegistrationOpens: [''],
      dRegistrationCloses: [''],
      sLocationPhysical: [' '],
      sLocationDigital: [''],
      sLocationAddress: [''],
      locCoordinates: this.fb.group({
        type: ['Point'],
        coordinates: [[0, 0]]
      }),
      sLocationDescription: [''],
      sCostDescription: [''],
      bAgeRestricted: [false],
      bIsPublic: [false], // dropdown with (true,false)
      sDressCode: [''], // dropdown type - (Traditional,Formal,Suit,Other) 
      bAllowRegistration: [true],
      sEventStatus: ['Open'],
      aAgenda: this.fb.array([]),
      aPrompts: this.fb.array([]),
      aSetOfQuestions: this.fb.array([]),
      aContactFields: this.fb.array([]),
      oOfficialUrls: this.fb.group({
        sWebsite: [''],
        sLinkedInPage: ['']
      }),
      aActivityList: this.fb.array([]),
      sPublishedNotes: [''],
      sNonPublishedNotes: [''],
      sNotesForTEO: [''],
      bAnonymousPublishing: [false]
    });
  }

  // openInformationDialog(type: string): void {
  //   const dialogRef = this.dialog.open(InformationDialogComponent, {
  //     width: '400px',
  //     data: { message: type }, 
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
  locationData: any = { type: 'Point', coordinates: [] }

  onValueChange(event: any) { }

  showInfo() {
    if (this.infoMessage == false) {
      this.infoMessage = true;
    } else {
      this.infoMessage = false;
    }
  }
  showInfo1() {
    if (this.infoMessage1 == false) {
      this.infoMessage1 = true;
    } else {
      this.infoMessage1 = false;
    }
  }
  showInfo2() {
    if (this.infoMessage2 == false) {
      this.infoMessage2 = true;
    } else {
      this.infoMessage2 = false;
    }
  }
  showInfo3() {
    if (this.infoMessage3 == false) {
      this.infoMessage3 = true;
    } else {
      this.infoMessage3 = false;
    }
  }
  showInfo4() {
    if (this.infoMessage4 == false) {
      this.infoMessage4 = true;
    } else {
      this.infoMessage4 = false;
    }
  }
  showInfo5() {
    if (this.infoMessage5 == false) {
      this.infoMessage5 = true;
    } else {
      this.infoMessage5 = false;
    }
  }
  showInfo6() {
    if (this.infoMessage6 == false) {
      this.infoMessage6 = true;
    } else {
      this.infoMessage6 = false;
    }
  }
  showInfo7() {
    if (this.infoMessage7 == false) {
      this.infoMessage7 = true;
    } else {
      this.infoMessage7 = false;
    }
  }
  showInfo8() {
    if (this.infoMessage8 == false) {
      this.infoMessage8 = true;
    } else {
      this.infoMessage8 = false;
    }
  }
  showInfo9() {
    if (this.infoMessage9 == false) {
      this.infoMessage9 = true;
    } else {
      this.infoMessage9 = false;
    }
  }
  showInfo10() {
    if (this.infoMessage10 == false) {
      this.infoMessage10 = true;
    } else {
      this.infoMessage10 = false;
    }
  }
  showInfo11() {
    if (this.infoMessage11 == false) {
      this.infoMessage11 = true;
    } else {
      this.infoMessage11 = false;
    }
  }
  showInfo12() {
    if (this.infoMessage12 == false) {
      this.infoMessage12 = true;
    } else {
      this.infoMessage12 = false;
    }
  }
  showInfo13() {
    if (this.infoMessage13 == false) {
      this.infoMessage13 = true;
    } else {
      this.infoMessage13 = false;
    }
  }
  showInfo14() {
    if (this.infoMessage14 == false) {
      this.infoMessage14 = true;
    } else {
      this.infoMessage14 = false;
    }
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm(): void {
    console.log(this.eventForm.value);
  }

  isLastStep(): boolean {
    return this.currentStep === 3;
  }

  selectLocation(location: any) {
    this.selectedLocation = location;
    this.locationControl.setValue(location.display_name);
    this.locationData.coordinates = [];
    // this.locationData.type=location.type;
    this.locationData.coordinates.push(location.lat)
    this.locationData.coordinates.push(location.lon)
    console.log('Selected Location:', this.selectedLocation);
    // this.locationSubscription.unsubscribe(); 
    this.locations = [];
    setTimeout(() => {
      this.locations = [];
    }, 700)
    console.log(this.locationData);

  }

  ngOnInit(): void {

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);


    this.authToken = localStorage.getItem('token');
    // console.log(this.authToken);
    this.decodeData = jwtDecode(this.authToken as string)
    console.log(this.decodeData.iOrganizationId);

    // this.initMap();
    this.initializeMap();
    this.getCurrentLocation()
    this.checkScreenSize()
  }


  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  // initMap() {
  //   const mapOptions: google.maps.MapOptions = {
  //     center: { lat: 51.505, lng: -0.09 },
  //     zoom: 13
  //   };
  //   this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);

  //   // Add click event listener to the map
  //   this.map.addListener('click', (event: google.maps.MouseEvent) => {
  //     this.zone.run(() => {
  //       console.log('Clicked at:', event.latLng.lat(), event.latLng.lng());
  //       // You can save the clicked coordinates or perform further actions here
  //     });
  //   });
  // }

  // onMapClick(event: LeafletMouseEvent): void {
  //   const lat = event.latlng.lat;
  //   const lng = event.latlng.lng;

  //   this.center = latLng(lat, lng);
  //   this.layers = [];
  //   this.layers.push(marker([lat, lng]));
  //   this.eventForm.patchValue({
  //     locCoordinates: {
  //       type: 'Point', // Assuming you want to set type as 'Point'
  //       coordinates: [lng, lat]
  //     }
  //   });
  // }

  urllink: string = "https://media.istockphoto.com/id/1452662817/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=bGI_FngX0iexE3EBANPw9nbXkrJJA4-dcEJhCrP8qMw=";
  selectFiles(event: any) {
    if (event.target.files) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.urllink = event.target.result
      }
    }
  }

  EventDetailForm: any = { sName: '', sEmail: '', sAddress: '', sLogo: '', sWebsite: '', sSubDomain: '', sTwitterUrl: '', sFacebookUrl: '', sLinkedinUrl: '' }

  submitData() {
    // console.log(this.screenshotData);
    const file = this.DataURIToBlob(this.urllink);
    // Call an API to send the screenshot data and user comment to the backend
    const formData = new FormData();
    if (this.locationData.coordinates.length == 0) {
      this.locationData.coordinates.push(0)
      this.locationData.coordinates.push(0)
    }
    if (this.eventForm.get('bIsPublic')?.value == true) {
      this.eventVisibility = false
    } else {
      this.eventVisibility = true
    }
    formData.append('sLogo', file, 'image.jpg')
    formData.append('iOrganizationId', this.decodeData.iOrganizationId);
    formData.append('userId', this.decodeData.iAdminId);
    formData.append('sName', this.eventForm.get('sName')?.value);
    formData.append('sDescription', this.eventForm.get('sDescription')?.value);
    formData.append('locCoordinates', JSON.stringify(this.locationData));
    formData.append('sLocationDigital', this.eventForm.get('sLocationDigital')?.value);
    formData.append('sLocationPhysical', this.eventForm.get('sLocationPhysical')?.value);
    formData.append('dRegistrationCloses', this.eventForm.get('dRegistrationCloses')?.value);
    formData.append('dRegistrationOpens', this.eventForm.get('dRegistrationOpens')?.value);
    formData.append('sEndTime', this.eventForm.get('sEndTime')?.value);
    formData.append('dEndDate', this.eventForm.get('dEndDate')?.value);
    formData.append('sStartTime', this.eventForm.get('sStartTime')?.value);
    formData.append('dStartDate', this.eventForm.get('dStartDate')?.value);
    formData.append('bIsPublic', this.eventVisibility + '');
    formData.append('sCostDescription', this.eventForm.get('sCostDescription')?.value);
    formData.append('sDressCode', this.eventForm.get('sDressCode')?.value);
    formData.append('adminEmail', localStorage.getItem('userEmail'));
    formData.append('oOfficialUrls', this.eventForm.get('oOfficialUrls')?.value);

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    if (this.eventForm.valid) {
      this.apiService.addEvents(formData, this.authToken).subscribe(
        response => {
          console.log(this.eventForm.value);
          console.log(response);
          Swal.fire({
            title: 'Event Created',
            showClass: {
              popup: 'animate__animated animate__fadeInDown',
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp',
            },
          });

          setTimeout(() => {
            this.router.navigateByUrl('events');
            this.eventForm.reset();
          }, 2000);
        },
        error => {
          if (error.status === 413) {
            Swal.fire({
              icon: 'error',
              title: 'File Too Large',
              text: 'The file you are trying to upload is too large. Please try a smaller file.',
            });
          }
          else if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: 'Server error event creating failed.',
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You do not have access to create.',
            });
          }
        }
      );

    } else {
      this.eventForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please check required fields *',
      });
    }
  }

  onSubmit() {
    this.eventForm.value.iOrganizationId = this.decodeData.iOrganizationId;
    this.eventForm.value.userId = this.decodeData.iAdminId;


    console.log(this.eventForm.value)

    if (this.eventForm.valid) {
      this.apiService.addEvents(this.eventForm.value, this.authToken).subscribe(response => {
        console.log(this.eventForm.value);
        console.log(response);
        Swal.fire({
          title:
            'Event Created',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });

        setTimeout(() => {
          this.router.navigateByUrl('event-dashboard');
          this.eventForm.reset();
        }, 2000);

      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You Not have Access to Create',
        });
      }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please check required fields *',
      });
    }
  }

  sendNewEvent(): void {

  }


  scrollToTop() {
    // Using the window object to scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  onDateChange(event: Event): void {

    console.log('Date:', event);
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      console.log('Date selected:', inputElement.value);

      setTimeout(() => {
        inputElement.blur();
        // Optionally focus another element to ensure blur
        const anotherElement = document.getElementById('anotherElementId');
        if (anotherElement) {
          anotherElement.focus();
        }
      }, 100);
    }
  }


  onTimeChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      console.log('Time selected:', inputElement.value);

      setTimeout(() => {
        inputElement.blur();
        // Optionally focus another element to ensure blur
        const anotherElement = document.getElementById('anotherElementId');
        if (anotherElement) {
          anotherElement.focus();
        }
      }, 100);
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.latitude = this.lat;
          this.longitude = this.lng;
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    }
  }

  openLocationPicker() {
    this.isMapMode = true
    // const modalRef = this.modalService.open(this.content, { size: 'lg', centered: true });
    // modalRef.result.then(
    //   (result) => {
    //     if (result === 'save') {
    //       this.location = `${this.latitude}, ${this.longitude}`;
    //     }
    //   },
    //   (reason) => {
    //     console.log('Dismissed: ', reason);
    //   }
    // );
  }
  mapWidth = '1000px'
  mapHeight = '700px'


  initializeMap(): void {
    // if (this.mapContainer && this.mapContainer.nativeElement) {
    //    const mapOptions: google.maps.MapOptions = {
    //     center: { lat: this.latitude, lng: this.longitude },
    //     zoom: this.zoom,
    //   };
    // }
  }
  onSaveLoc() {
    this.location = `${this.latitude}, ${this.longitude}`;
    this.mapService.getLocation(this.latitude, this.longitude).subscribe((res: any) => {
      console.log('location', res.display_name)
      const address = res.display_name
      this.isMapMode = false
      this.eventForm.patchValue({ sLocationAddress: address });

      this.locationData.coordinates = [];
      // this.locationData.type=location.type;
      this.locationData.coordinates.push(this.latitude)
      this.locationData.coordinates.push(this.longitude)
    })
  }

  // onMapClick(event: google.maps.MapMouseEvent) {
  //   console.log('clicking')
  //   const latLng = event.latLng?.toJSON();
  //   if (latLng) {
  //     this.latitude = latLng.lat;
  //     this.longitude = latLng.lng;
  //     this.updateMarkerPosition();
  //   }
  // }


  // onMarkerDragEnd(event: google.maps.MapMouseEvent) {
  //   console.log('draging')
  //   const latLng = event.latLng?.toJSON();
  //   if (latLng) {
  //     this.latitude = latLng.lat;
  //     this.longitude = latLng.lng;
  //     this.updateMarkerPosition();
  //   }
  // }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth <= 768;
    if (this.isMobileScreen) {
      this.mapWidth = '100%'
      this.mapHeight = '600px';
    }
    console.log('Is Mobile Screen:', this.isMobileScreen);
  }

  // updateMarkerPosition() {
  //   if (this.mapMarker) {
  //     this.mapMarker.position = { lat: this.latitude, lng: this.longitude };
  //   } else {
  //     console.error('MapMarker is not defined');
  //   }
  // }

  updateSelectedLocation(lat: any, lng: any, address?: string) {
    this.selectedLocation = { lat, lng };
    this.latitude = lat;
    this.longitude = lng;
    this.zoom = 14; // Adjust the zoom level as needed
    // if (address) {
    //   this.address = address;
    // } else {
    //   this.getAddress(lat, lng);
    // }
  }


  // searchLocation(): void {
  //   const geocoder = new google.maps.Geocoder();
  //   geocoder.geocode({ address: this.searchQuery }, (results, status) => {
  //     if (status === 'OK' && results[0]) {
  //       const location = results[0].geometry.location;
  //       this.latitude = location.lat();
  //       this.longitude = location.lng();
  //       this.lat=location.lat();
  //       this.lng=location.lng();
  //       // Angular Google Maps will automatically update the map's center and marker position
  //     } else {
  //       console.error('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }

  closeMap() {
    this.isMapMode = false
  }
}