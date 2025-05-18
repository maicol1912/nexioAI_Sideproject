import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response {
  success?: boolean;
  data: any;
}

export interface TransformationInterceptorOptions {
  contentDispositionHeader?: string;
}

export class GlobalResponseInterceptor<T> implements NestInterceptor<T, Response> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();
    const statusCode = response.statusCode;

    const contentType = response.get('Content-Type');
    if (contentType && contentType.startsWith('application')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((responseData) => {
        let success = responseData?.success;
        if (success === undefined) {
          success = statusCode >= 200 && statusCode < 300;
        }
        const formattedResponse = formatResponse(responseData);
        return {
          success: success,
          data: formattedResponse,
        };
      })
    );
  }
}

function formatResponse(response: any) {
  if (Array.isArray(response)) {
    return { data: response };
  }
  if (typeof response === 'string') {
    return response;
  }
  return response || {};
}