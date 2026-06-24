import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // NestJS built-in exceptions return an object from getResponse(), e.g.:
    //   { message: 'Invalid credentials', error: 'Unauthorized', statusCode: 401 }
    //   { message: ['field is required'], error: 'Bad Request', statusCode: 400 }
    // Extract only the message string so the frontend always receives a plain string.
    const rawResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let message: string;
    if (typeof rawResponse === 'string') {
      message = rawResponse;
    } else if (rawResponse && typeof rawResponse === 'object') {
      const r = rawResponse as Record<string, unknown>;
      if (Array.isArray(r.message)) {
        message = (r.message as string[]).join(', ');
      } else if (typeof r.message === 'string') {
        message = r.message;
      } else {
        message = 'An error occurred';
      }
    } else {
      message = 'An error occurred';
    }

    this.logger.error(
      `${request.method} ${request.url} → ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
