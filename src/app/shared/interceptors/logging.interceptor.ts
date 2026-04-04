import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();

  return next(req).pipe(
    tap({
      next: (event) => {
        const elapsed = Date.now() - started;
        console.log(`interceptor [${req.method}] ${req.url} - ${elapsed}ms ${event}`);
      },
      error: (err) => {
        const elapsed = Date.now() - started;
        console.error(`[${req.method}] ${req.url} - Error after ${elapsed}ms`, err);
      }
    })
  );
};
