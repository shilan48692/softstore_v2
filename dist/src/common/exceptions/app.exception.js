"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorException = exports.ConflictException = exports.BadRequestException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.AppException = void 0;
const common_1 = require("@nestjs/common");
const error_messages_1 = require("../constants/error-messages");
class AppException extends common_1.HttpException {
    constructor(errorCode, status = common_1.HttpStatus.BAD_REQUEST, details) {
        super({
            message: error_messages_1.ErrorMessages[errorCode],
            errorCode,
            details,
        }, status);
        this.details = details;
    }
}
exports.AppException = AppException;
class UnauthorizedException extends AppException {
    constructor(errorCode = 'UNAUTHORIZED', details) {
        super(errorCode, common_1.HttpStatus.UNAUTHORIZED, details);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends AppException {
    constructor(errorCode = 'FORBIDDEN', details) {
        super(errorCode, common_1.HttpStatus.FORBIDDEN, details);
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends AppException {
    constructor(errorCode = 'RESOURCE_NOT_FOUND', details) {
        super(errorCode, common_1.HttpStatus.NOT_FOUND, details);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends AppException {
    constructor(errorCode = 'INVALID_REQUEST', details) {
        super(errorCode, common_1.HttpStatus.BAD_REQUEST, details);
    }
}
exports.BadRequestException = BadRequestException;
class ConflictException extends AppException {
    constructor(errorCode = 'DUPLICATE_ENTRY', details) {
        super(errorCode, common_1.HttpStatus.CONFLICT, details);
    }
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends AppException {
    constructor(errorCode = 'INTERNAL_SERVER_ERROR', details) {
        super(errorCode, common_1.HttpStatus.INTERNAL_SERVER_ERROR, details);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
//# sourceMappingURL=app.exception.js.map