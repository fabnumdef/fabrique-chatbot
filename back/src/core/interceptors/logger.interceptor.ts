import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BotLogger } from "../../logger/bot.logger";
const crypto = require('crypto');

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly _logger = new BotLogger('LoggerInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const id = crypto.randomBytes(8).toString("hex");
    const req = context.getArgByIndex(0);
    const body = {...req.body};
    if (body?.password) {
      body.password = 'PASSWORD';
    }
    this._logger.log(`REQUEST - ${id} - ${req.ip} - ${req.user?.email} - ${req.method} - ${req.originalUrl} - ${!body ? '' : JSON.stringify(body)}`);

    return next
      .handle()
      .pipe(
        tap(() => {
          this._logger.log(`RESPONSE - ${id}`);
        }),
      );
  }
}
