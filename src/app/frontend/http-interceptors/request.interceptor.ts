/**
 * Copyright 2022 The KubeDiag Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ErrorDialogService } from './../error-dialog/error-dialog.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

const baseUrl = '/api/kubediag';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public errorDialogService: ErrorDialogService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      url: `${baseUrl}${request.url}`,
    });
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorDialogService.openDialog(error);
        return throwError(error.message);
      })
    );
  }
}
