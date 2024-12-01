import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 14;
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerOptions: google.maps.MarkerOptions = { draggable: true };

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number; address: string }>();
  @Output() cancelSelection = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.getUserLocation();
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.updateLocation(event.latLng.lat(), event.latLng.lng());
    }
  }

  // Update location based on lat/lng
  updateLocation(lat: number, lng: number) {
    this.markerPosition = { lat, lng };

    // Fetch the address using the Geocoding API
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;

        // Emit the updated location
        this.locationSelected.emit({ lat, lng, address });
      } else {
        console.error('Geocoder failed due to:', status);
        this.locationSelected.emit({ lat, lng, address: 'Address not available' });
      }
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.markerPosition = this.center;
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
    }
  }

  saveLocation() {
    const { lat, lng } = this.markerPosition;

    // Use Google Maps Geocoding API to get the address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;

        // Emit the location object with lat, lng, and address
        this.locationSelected.emit({ lat, lng, address });
      } else {
        console.error('Geocoder failed due to:', status);
        this.locationSelected.emit({ lat, lng, address: 'Address not available' });
      }
    });
  }

  cancelLocation() {
    this.cancelSelection.emit(false);
  }
}
