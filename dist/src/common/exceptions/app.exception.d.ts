import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-messages';
export declare class AppException extends HttpException {
    readonly details?: any;
    constructor(errorCode: ErrorCode, status?: HttpStatus, details?: any);
}
export declare class UnauthorizedException extends AppException {
    constructor(errorCode?: ErrorCode, details?: any);
}
export declare class ForbiddenException extends AppException {
    constructor(errorCode?: ErrorCode, details?: any);
}
export declare class NotFoundException extends AppException {
    constructor(errorCode?: ErrorCode, details?: any);
}
export declare class BadRequestException extends AppException {
    constructor(errorCode?: ErrorCode, details?: any);
}
export declare class ConflictException extends AppException {
    constructor(errorCode?: ErrorCode, details?: any);
}
export declare class InternalServerErrorException extends AppException {
    constructor(errorCode?: ErrorCode, details?: any);
}
