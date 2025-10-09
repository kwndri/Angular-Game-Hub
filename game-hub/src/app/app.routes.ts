import { Routes } from '@angular/router';
import { HomeComponent, resolveGenreName } from './home/home.component';
import { DetailsComponent } from './components/detais/detais.component';
import { LoginComponent } from './login/login/login.component';
import { authGuard } from './guards/authGuard';
import { NotFoundComponent } from './not-found/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      genreName: resolveGenreName,
    },
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'search/:gameSearch',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'details/:gameId',
    component: DetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
