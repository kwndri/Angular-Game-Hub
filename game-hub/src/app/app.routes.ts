import { Routes } from '@angular/router';
import { HomeComponent, resolveGenreName } from './home/home.component';
import { DetailsComponent } from './components/detais/detais.component';
import { LoginComponent } from './login/login/login.component';
import { NotFoundComponent } from './not-found/not-found/not-found.component';
import { authGuard } from './guards/authGuard';
import { MainLayoutComponent } from './main-layout-component/main-layout-component';
import { AuthLayoutComponent } from './auth-layout-component/auth-layout-component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: HomeComponent,
        resolve: { genreName: resolveGenreName },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'details/:gameId',
        component: DetailsComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', component: NotFoundComponent },
];
