import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app/app.routes';
import { rawgApiKey } from './enviroment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = rawgApiKey;

  const modifiedReq = req.clone({
    setParams: {
      key: apiKey,
    },
  });

  return next(modifiedReq);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([apiKeyInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(), // Enables @Input binding from route params
      withRouterConfig({
        paramsInheritanceStrategy: 'always', // ✅ Makes params like `:gameSearch` available to all nested routes
      })
    ),
    ...appConfig.providers, // Optional if you have global config
  ],
}).catch((err) => console.error(err));
