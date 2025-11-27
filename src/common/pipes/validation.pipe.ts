import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const result = this.formatErrors(errors);
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          details: result,
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]): any {
    return errors.reduce((acc, error) => {
      if (error.children && error.children.length > 0) {
        acc[error.property] = this.formatErrors(error.children);
      } else {
        acc[error.property] = Object.values(error.constraints || {});
      }
      return acc;
    }, {});
  }
}