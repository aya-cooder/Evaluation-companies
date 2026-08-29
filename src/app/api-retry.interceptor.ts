import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import {
  Observable,
  timer,
  throwError
} from 'rxjs';

import {
  catchError,
  switchMap,
  tap
} from 'rxjs/operators';
import { ApiStatusService } from './Services/api-status.service';


@Injectable()
export class ApiRetryInterceptor implements HttpInterceptor {

  private readonly apiUrl =
    'https://evalautioncompany-42df5.containers.snapdeploy.app';

  // وقت انتظار SnapDeploy للـ Cold Start
  private readonly wakeWaitTime = 70000;

  // بعد ما نصحي الـ Container ندي الـ API محاولات إضافية
  private readonly maxRetries = 5;

  // الانتظار بين المحاولات بعد الـ wake
  private readonly retryDelay = 5000;

  // يمنع أكثر من Wake في نفس الوقت
  private wakingUp = false;

  constructor(
    private apiStatus:ApiStatusService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // نتعامل فقط مع Backend بتاعنا
    if (!request.url.startsWith(this.apiUrl)) {
      return next.handle(request);
    }

    console.log(
      '🌐 API Request:',
      request.url
    );

    return this.sendRequest(
      request,
      next,
      0
    );
  }

  private sendRequest(
    request: HttpRequest<any>,
    next: HttpHandler,
    attempt: number
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(

      tap(event => {

        if (event instanceof HttpResponse) {

          console.log(
            '✅ API is ready! Data received:',
            request.url
          );

          this.apiStatus.hideWakingUp();
          this.wakingUp = false;
        }

      }),

      catchError(error => {

        console.log(
          `❌ API failed - attempt ${attempt + 1}/${this.maxRetries}`,
          'Status:',
          error.status,
          request.url
        );

        /*
         * =========================================
         * هل ده Cold Start؟
         * =========================================
         *
         * SnapDeploy بيرجع 503.
         *
         * بسبب CORS Angular ممكن يشوف:
         *
         * status = 0
         *
         * لذلك بنتعامل مع 503 و 0.
         */

        const wakeHeader =
          error?.headers?.get('X-Wake-Page');

        const isColdStart =
          error.status === 503 ||
          (
            error.status === 0 &&
            request.url.startsWith(this.apiUrl)
          );

        console.log(
          '🔥 Cold Start:',
          isColdStart
        );

        console.log(
          '📌 Status:',
          error.status
        );

        console.log(
          '📌 X-Wake-Page:',
          wakeHeader
        );

        /*
         * =========================================
         * لو مش Cold Start
         * =========================================
         */

        if (!isColdStart) {

          console.log(
            '⚠️ Normal API error - no retry.'
          );

          this.apiStatus.hideWakingUp();

          return throwError(() => error);
        }

        /*
         * =========================================
         * أول مرة نكتشف إن الـ Container نايم
         * =========================================
         */

        if (!this.wakingUp) {

          this.wakingUp = true;

          this.apiStatus.showWakingUp();

          console.log(
            '🚀 Starting SnapDeploy wake-up process...'
          );

          /*
           * مهم جدًا:
           *
           * مش هنعمل XHR هنا.
           *
           * هنفتح Navigation للـ API
           * عشان SnapDeploy يتعامل معاه
           * كأنه فتح الرابط يدويًا.
           */

          this.wakeApi(request.url);

          console.log(
            `⏳ Waiting ${
              this.wakeWaitTime / 1000
            } seconds for SnapDeploy...`
          );

          /*
           * نستنى 70 ثانية.
           */

          return timer(this.wakeWaitTime).pipe(

            switchMap(() => {

              console.log(
                '⏰ Wake wait finished.'
              );

              console.log(
                '🔄 Retrying original API request...'
              );

              return this.sendRequest(
                request,
                next,
                0
              );

            })

          );
        }

        /*
         * =========================================
         * الـ Container بالفعل بيصحى
         * =========================================
         */

        if (attempt >= this.maxRetries - 1) {

          console.log(
            '❌ API could not be reached after wake-up.'
          );

          this.apiStatus.hideWakingUp();

          this.wakingUp = false;

          return throwError(() => error);
        }

        console.log(
          `⏳ Container is still waking up. ` +
          `Waiting ${this.retryDelay / 1000} seconds...`
        );

        return timer(this.retryDelay).pipe(

          switchMap(() => {

            console.log(
              `🔄 Retrying API request ` +
              `${attempt + 2}/${this.maxRetries}:`,
              request.url
            );

            return this.sendRequest(
              request,
              next,
              attempt + 1
            );

          })

        );
      })

    );
  }

  /*
   * =========================================
   * Wake SnapDeploy
   * =========================================
   *
   * مهم:
   * دي Navigation وليست XMLHttpRequest.
   *
   * وبالتالي CORS لن يمنع عملية الـ Wake.
   */

  private wakeApi(url: string): void {

    console.log(
      '🔥 Sending browser navigation to wake SnapDeploy:',
      url
    );

    const iframe =
      document.createElement('iframe');

    /*
     * نخليه غير مرئي.
     */

    iframe.style.position = 'fixed';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';

    /*
     * فتح نفس API URL.
     *
     * SnapDeploy هيشوف Navigation
     * ويبدأ تشغيل الـ Container.
     */

    iframe.src = url;

    document.body.appendChild(iframe);

    /*
     * بعد دقيقتين نشيل الـ iframe.
     */

    setTimeout(() => {

      try {

        iframe.remove();

        console.log(
          '🧹 Wake iframe removed.'
        );

      } catch (e) {

        console.log(
          '⚠️ Could not remove wake iframe.',
          e
        );

      }

    }, 120000);
  }
}