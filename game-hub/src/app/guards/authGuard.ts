import { Injectable, inject } from '@angular/core';
import {
  CanMatch,
  Router,
  Route,
  UrlSegment,
  RouterModule,
  RedirectCommand,
  CanMatchFn,
  CanActivateFn,
} from '@angular/router';
import { Authervice } from '../services/authService';

export const authGuard: CanActivateFn = (route, segment) => {
  const authService = inject(Authervice);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    return new RedirectCommand(router.parseUrl('/login'));
  }
};
