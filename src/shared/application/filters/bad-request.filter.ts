import { HttpStatus, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, UnprocessableEntityException } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { AxiosException } from '@shared/domain/exceptions/axios.exception';
import { ExceptionResponse } from '@shared/domain/exceptions/exception.response';
import type { ValidationError } from 'class-validator';
import type { Response } from 'express';
import _ from 'lodash';

type ResponseException = string | { message?: string; details?: string;[key: string]: any };

@Catch(UnprocessableEntityException)
export class HttpExceptionFilter
  implements ExceptionFilter<UnprocessableEntityException> {
  constructor(public reflector: Reflector) { }

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const r = exception.getResponse() as { message: ValidationError[] };

    const validationErrors = r.message;
    this.validationFilter(validationErrors);

    response.status(statusCode).json(r);
  }

  private validationFilter(validationErrors: ValidationError[]): void {
    for (const validationError of validationErrors) {
      const children = validationError.children;

      if (children && !_.isEmpty(children)) {
        this.validationFilter(children);

        return;
      }

      delete validationError.children;

      const constraints = validationError.constraints;

      if (!constraints) {
        return;
      }

      for (const [constraintKey, constraint] of Object.entries(constraints)) {
        if (!constraint) {
          constraints[constraintKey] = `error.fields.${_.snakeCase(
            constraintKey,
          )}`;
        }
      }
    }
  }
}

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus: HttpStatus;
    let responseBody: any;
    if (exception instanceof ExceptionResponse) {
      this.printException(exception.getResponse() || exception, host);
      httpStatus = exception.getStatus();
      responseBody = {
        success: false,
        statusCode: httpStatus,
        error: true,
        ...this.formatExceptionResponse(exception.getResponse()),
      };
    } else if (exception instanceof AxiosException) {
      this.printException(
        exception.getAxiosErrorResponse() ?? exception,
        host,
        'Error al comunicarse con el servicio Core'
      );
      const axiosErrorResponse = exception.getAxiosErrorResponse();
      httpStatus = axiosErrorResponse?.data?.status || 500;
      responseBody = {
        success: false,
        statusCode: axiosErrorResponse?.data?.status || 500,
        error: axiosErrorResponse?.data?.message ?? exception.getResponse(),
      };
    } else if (exception instanceof HttpException) {
      this.printException(exception.getResponse() || exception, host);
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ResponseException;
      responseBody = {
        success: false,
        statusCode: httpStatus,
        error:
          typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message || 'Error desconocido',
      };
    } else {
      this.printException(exception, host);
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        success: false,
        statusCode: httpStatus,
        error: 'Error desconocido',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private formatExceptionResponse(exceptionResponse: any): any {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      return { ...exceptionResponse };
    }
    return { error: exceptionResponse };
  }

  printException(exception: any, host: any, detail?: any) {
    console.error('\x1b[41m\x1b[37m\x1b[1m NEW EXCEPTION ==> \x1b[0m');
    console.error({
      detail,
      url: host.getArgs()[0]?.url,
      exception: exception,
    });
    console.error('\x1b[41m\x1b[37m\x1b[1m **END EXCEPTION**\x1b[0m');
  }
}