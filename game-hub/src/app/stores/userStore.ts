/*// src/app/store/user.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private _user = signal<User | null>(null);

  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._user());

  constructor() {
    // restore user if you persist it later
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        this._user.set(JSON.parse(saved));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  setUser(user: User) {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this._user.set(null);
    localStorage.removeItem('user');
  }
}
*/
