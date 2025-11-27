import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);
    
    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }
    
    if (Object.keys(query || {}).length > 0) {
      this.logger.debug(`Query Parameters: ${JSON.stringify(query)}`);
    }
    
    if (Object.keys(params || {}).length > 0) {
      this.logger.debug(`Route Parameters: ${JSON.stringify(params)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(`Outgoing Response: ${method} ${url} - ${duration}ms`);
          
          if (data && typeof data === 'object') {
            this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(`Request Failed: ${method} ${url} - ${duration}ms`);
          this.logger.error(`Error: ${error.message}`);
        },
      }),
    );
  }
}