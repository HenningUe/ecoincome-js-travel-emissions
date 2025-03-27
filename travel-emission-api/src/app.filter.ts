import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpStatus } from '@nestjs/common';;
import { Response } from 'express';
import * as Sentry from '@sentry/node';
import { BaseExceptionFilter } from '@nestjs/core';


/**
 * A global exception filter that catches all exceptions and reports them to Sentry.
 */
@Catch()
export class SentryCatchAllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Sentry.captureException(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Internal server error. Error was reported to the development team. Please try again later.`,
    });
  }
}


/**
 * A filter that catches 404 (url not found) errors and returns a custom error message.
 */
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const baseUrl = `${response.req.protocol}://${response.req.get('host')}`;

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: `API path not found. Please checkout the API documentation at ${baseUrl}/api/docs`,
    });
  }
}