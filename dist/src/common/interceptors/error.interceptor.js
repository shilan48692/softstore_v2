"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ErrorInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const app_exception_1 = require("../exceptions/app.exception");
const error_messages_1 = require("../constants/error-messages");
let ErrorInterceptor = ErrorInterceptor_1 = class ErrorInterceptor {
    constructor() {
        this.logger = new common_1.Logger(ErrorInterceptor_1.name);
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const path = request.url;
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            let statusCode;
            let message;
            let errorCode;
            let details;
            if (error instanceof app_exception_1.AppException) {
                const response = error.getResponse();
                statusCode = error.getStatus();
                message = response.message || 'An application error occurred';
                errorCode = response.errorCode || 'APP_ERROR';
                details = response.details;
                this.logger.warn(`[AppException] Path: ${path} | Status: ${statusCode} | Code: ${errorCode} | Message: ${message}${details ? ' | Details: ' + JSON.stringify(details) : ''}`);
            }
            else if (error instanceof common_1.HttpException) {
                statusCode = error.getStatus();
                const response = error.getResponse();
                if (typeof response === 'string') {
                    message = response;
                }
                else if (typeof response === 'object' && response !== null && 'message' in response) {
                    message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
                    details = response;
                }
                else {
                    message = error.message || 'An HTTP error occurred';
                }
                errorCode = error.name || `HTTP_${statusCode}`;
                this.logger.warn(`[HttpException] Path: ${path} | Status: ${statusCode} | Message: ${message}${details ? ' | Details: ' + JSON.stringify(details) : ''}`);
            }
            else {
                statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                message = error_messages_1.ErrorMessages['INTERNAL_SERVER_ERROR'] || 'An unexpected internal server error occurred.';
                errorCode = 'INTERNAL_SERVER_ERROR';
                details = { originalError: error.message };
                this.logger.error(`[UnhandledException] Path: ${path} | Status: ${statusCode} | Message: ${message} | Error: ${error.message}`, error.stack);
            }
            const errorResponse = {
                success: false,
                statusCode,
                message,
                errorCode,
                timestamp: new Date().toISOString(),
                path,
                details,
            };
            return (0, rxjs_1.throwError)(() => new common_1.HttpException(errorResponse, statusCode));
        }));
    }
};
exports.ErrorInterceptor = ErrorInterceptor;
exports.ErrorInterceptor = ErrorInterceptor = ErrorInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], ErrorInterceptor);
//# sourceMappingURL=error.interceptor.js.map