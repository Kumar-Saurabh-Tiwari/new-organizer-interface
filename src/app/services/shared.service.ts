import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    private businessLogoSubject = new BehaviorSubject<string | null>(this.getLogoFromLocalStorage());
    businessLogo$ = this.businessLogoSubject.asObservable();
  
    private readonly LOCAL_STORAGE_KEY = 'businessLogo';
  
    constructor() {}
  
    // Method to set the logo and store in localStorage
    setBusinessLogo(logoUrl: string): void {
      console.log('Setting logo:', logoUrl);  // Debugging
      this.businessLogoSubject.next(logoUrl);
      this.saveLogoToLocalStorage(logoUrl);
    }
  
    // Method to get the logo (fallback to localStorage if in-memory is null)
    getBusinessLogo(): string | null {
      const logo = this.businessLogoSubject.value || this.getLogoFromLocalStorage();
      console.log('Getting logo:', logo);  // Debugging
      return logo;
    }
  
    // Save logo to localStorage
    private saveLogoToLocalStorage(logoUrl: string): void {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, logoUrl);
      console.log('Logo saved to localStorage:', logoUrl);  // Debugging
    }
  
    // Retrieve logo from localStorage
      getLogoFromLocalStorage(): string | null {
      const logo = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      console.log('Logo retrieved from localStorage:', logo);  // Debugging
      return logo;
    }
  
    // Clear logo from both memory and localStorage
    clearBusinessLogo(): void {
      this.businessLogoSubject.next(null);
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      console.log('Logo cleared from memory and localStorage');  // Debugging
    }
}
