/*// src/app/services/auth.service.ts
import { Injectable, signal, computed, effect, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStore } from '../store/user.store';
import { User } from '../models/user.model';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private userStore = inject(UserStore);

  // 🔹 Internal signals
  private _accessToken = signal<string | null>(null); // in-memory only
  private _refreshToken = signal<string | null>(localStorage.getItem('refresh_token'));

  // 🔹 Public readonly signals
  readonly accessToken = computed(() => this._accessToken());
  readonly refreshToken = computed(() => this._refreshToken());
  readonly isLoading = signal(false);

  // 🔹 Authentication state depends on refreshToken + user
  readonly isAuthenticated = computed(() => !!this._refreshToken() && !!this.userStore.user());

  constructor() {
  const refresh = this._refreshToken();

  if (refresh) {
    // Startup: refresh access token once, then fetch user info
    this.refreshAccessToken(true);
  } else {
    // No refresh token → logout
    this.logOut();
  }

    // 3️⃣ Auto logout if refreshToken disappears
    effect(() => {
      if (!this._refreshToken()) {
        this.userStore.clearUser();
        this.router.navigate(['/login']);
      }
    });

    // 4️⃣ Auto-refresh access token every 15 minutes
    effect((onCleanup) => {
      if (!this._refreshToken(false)) return;

      const intervalId = setInterval(() => {
        this.refreshAccessToken();
      }, 15 * 60 * 1000); // 15 minutes

      onCleanup(() => clearInterval(intervalId));
    });

   
  }

  // 🔹 Login method
  login(email: string, password: string) {
    this.isLoading.set(true);
    this.http.post<LoginResponse>('/auth/login', { email, password }).subscribe({
      next: (res) => {
        this._accessToken.set(res.accessToken);
        this._refreshToken.set(res.refreshToken);
        localStorage.setItem('refresh_token', res.refreshToken);

        this.fetchUserInfo(() => {
          this.isLoading.set(false);
          this.router.navigate(['/']); // redirect after successful login
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.isLoading.set(false);
      },
    });
  }

  // 🔹 Refresh access token
  private refreshAccessToken(fetchUser: boolean = false) {
  const refresh = this._refreshToken();
  if (!refresh) return;

  this.http.post<RefreshResponse>('/auth/refresh', { refreshToken: refresh }).subscribe({
    next: (res) => {
      this._accessToken.set(res.accessToken);

      if (res.refreshToken) {
        this._refreshToken.set(res.refreshToken);
        localStorage.setItem('refresh_token', res.refreshToken);
      }

      if (fetchUser) {
        this.fetchUserInfo();
      }
    },
    error: () => this.logOut(),
  });
}
  }

  // 🔹 Fetch user info
  fetchUserInfo() {
    const token = this._accessToken();
    if (!token) return;

    this.http.get<User>('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (user) => {
        this.userStore.setUser({ ...user, accessToken: token } as any);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to fetch user info:', err);
        this.logOut();
        this.router.navigate(['/login']);
      },
    });
  }

  // 🔹 Logout
  logOut() {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('refresh_token');
    this.userStore.clearUser();
    this.router.navigate(['/login']);
  }
}
*/
