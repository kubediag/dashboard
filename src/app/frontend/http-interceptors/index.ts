import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './request.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
];
