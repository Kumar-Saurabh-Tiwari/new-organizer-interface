// device.service.ts
import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  // Define the breakpoint for mobile devices
  private mobileBreakpoint = '(max-width: 767px)';

  // Observable that emits true if on mobile view, false otherwise
  isMobile$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver
      .observe([this.mobileBreakpoint])
      .pipe(
        map((state: BreakpointState) => state.matches),
        shareReplay() // Ensures that multiple subscribers share the same observable
      );
  }

  /**
   * Returns an Observable<boolean> indicating if the device is mobile.
   */
  isMobile(): Observable<boolean> {
    return this.isMobile$;
  }
}
