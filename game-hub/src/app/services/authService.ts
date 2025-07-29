import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

interface LoginResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Authervice {
  private httpClient = inject(HttpClient);
  error = signal('');
  private _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  router = inject(Router);

  constructor() {
    // Sync token with signal on startup
    const token = localStorage.getItem('token');
    this._isLoggedIn.set(!!token);
  }

  onSubmit(userName: string, password: string) {
    return this.httpClient
      .post<LoginResponse>('http://localhost:3000/login', {
        username: userName,
        password: password,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let msg = 'Something went wrong. Please try again.';

          if (error.status === 0) {
            // Network error or server down
            msg =
              'Cannot connect to server. Please check your internet connection.';
          } else if (error.status === 401) {
            // Unauthorized
            msg = 'Invalid username or password.';
          } else if (error.status === 500) {
            // Server error
            msg = 'Server error occurred. Please try later.';
          } else if (error.error?.message) {
            // Backend message
            msg = error.error.message;
          }

          this.error.set(msg);
          return throwError(() => new Error(msg));
        })
      );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  isAuthenticated() {
    return this._isLoggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setLoggedIn(value: boolean) {
    this._isLoggedIn.set(value);
  }
}
