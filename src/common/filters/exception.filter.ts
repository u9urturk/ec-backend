import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma known errors
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Resource already exists';
          errorCode = 'DUPLICATE_RESOURCE';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
          errorCode = 'RESOURCE_NOT_FOUND';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed';
          errorCode = 'FOREIGN_KEY_CONSTRAINT';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database operation failed';
          errorCode = 'DATABASE_ERROR';
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided';
      errorCode = 'VALIDATION_ERROR';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: errorCode,
      message,
    };

    response.status(status).json(errorResponse);
  }
}