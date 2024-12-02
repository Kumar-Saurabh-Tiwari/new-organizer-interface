import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'secureToken';

  constructor() {}

  setSecureToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getSecureToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeSecureToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
