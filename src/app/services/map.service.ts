import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  searchLocation(location: string) {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError('Error fetching location data');
      })
    );
  }

  getLocation(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError('Error fetching location data');
      })
    );
  }
}
