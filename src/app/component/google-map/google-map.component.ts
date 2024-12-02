import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit, OnChanges {
  @Input() initialCoordinates: { lat: number; lng: number } | null = null;
  @Input() initialAddress: string | null = null;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number; address: string }>();
  @Output() cancelSelection = new EventEmitter<boolean>();

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 14;
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  address: string = '';

  ngOnInit(): void {
    if (this.initialCoordinates) {
      this.setMapData();
    } else {
      this.getUserLocation();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCoordinates'] || changes['initialAddress']) {
      this.setMapData();
    }
  }

  setMapData() {
    if (this.initialCoordinates) {
      this.center = { ...this.initialCoordinates };
      this.markerPosition = { ...this.initialCoordinates };
    }
    if (this.initialAddress) {
      this.address = this.initialAddress;
    }
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
      this.updateAddress();
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.updateAddress();
    }
  }

  updateAddress() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: this.markerPosition }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.address = results[0].formatted_address;
      } else {
        this.address = 'Unknown location';
        console.error('Geocoder failed:', status);
      }
    });
  }

  saveLocation() {
    const locationData = {
      lat: this.markerPosition.lat,
      lng: this.markerPosition.lng,
      address: this.address,
    };
    this.locationSelected.emit(locationData);
  }

  cancelLocation() {
    this.cancelSelection.emit(false);
  }
}
