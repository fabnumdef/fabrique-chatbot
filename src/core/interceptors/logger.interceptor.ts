import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const crypto = require('crypto');

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const id = crypto.randomBytes(8).toString("hex");
    const req = context.getArgByIndex(0);
    console.log(`REQUEST - ${id} - ${new Date().toISOString()} - ${req.ip} - ${req.user ? req.user.email : null} - ${req.originalUrl} - ${req.originalUrl.includes('/login') ? null : JSON.stringify(req.body)}`);

    return next
      .handle()
      .pipe(
        tap(() => {
          console.log(`RESPONSE - ${id} - ${new Date().toISOString()}`);
        }),
      );
  }
}
