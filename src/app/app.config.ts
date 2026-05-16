import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import esLocale from '@angular/common/locales/es';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import routes from '@app/app.routes';
import TokenInterceptor from '@interceptors/token.interceptor';
import provideCore from '@modules/core';
import UserService from '@services/user.service';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

registerLocaleData(esLocale);

const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer((): void => inject(UserService).loadLogin()),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling(scrollConfig),
      withComponentInputBinding(),
    ),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideCore(),
  ],
};

export default appConfig;
