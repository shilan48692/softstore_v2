import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from '../constants/error-messages';

export class AppException extends HttpException {
  constructor(
    errorCode: ErrorCode,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: any,
  ) {
    super(
      {
        message: ErrorMessages[errorCode],
        errorCode,
        details,
      },
      status,
    );
  }
}

// Các exception cụ thể
export class UnauthorizedException extends AppException {
  constructor(errorCode: ErrorCode = 'UNAUTHORIZED', details?: any) {
    super(errorCode, HttpStatus.UNAUTHORIZED, details);
  }
}

export class ForbiddenException extends AppException {
  constructor(errorCode: ErrorCode = 'FORBIDDEN', details?: any) {
    super(errorCode, HttpStatus.FORBIDDEN, details);
  }
}

export class NotFoundException extends AppException {
  constructor(errorCode: ErrorCode = 'RESOURCE_NOT_FOUND', details?: any) {
    super(errorCode, HttpStatus.NOT_FOUND, details);
  }
}

export class BadRequestException extends AppException {
  constructor(errorCode: ErrorCode = 'INVALID_REQUEST', details?: any) {
    super(errorCode, HttpStatus.BAD_REQUEST, details);
  }
}

export class ConflictException extends AppException {
  constructor(errorCode: ErrorCode = 'DUPLICATE_ENTRY', details?: any) {
    super(errorCode, HttpStatus.CONFLICT, details);
  }
}

export class InternalServerErrorException extends AppException {
  constructor(errorCode: ErrorCode = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(errorCode, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
} 