"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt-admin') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.startsWith('Bearer ')
            ? request.headers.authorization.substring(7)
            : (request.cookies ? request.cookies['accessToken'] : undefined);
        console.log(`>>> JwtAuthGuard processing request for: ${request.url}`);
        console.log(`>>> Token presented (header or cookie): ${token ? 'Exists' : 'NONE'}`);
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        if (err || !user) {
            let errorMessage = 'Unauthorized';
            if (info instanceof Error) {
                errorMessage = info.message;
            }
            else if (typeof info === 'string') {
                errorMessage = info;
            }
            console.error(`>>> JwtAuthGuard Unauthorized on path ${request.url}: ${errorMessage}`, err);
            throw err || new common_1.UnauthorizedException(errorMessage);
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map