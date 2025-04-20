"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const admin_auth_service_1 = require("../../admin-auth/admin-auth.service");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(jwtService, configService, authService) {
        super();
        this.jwtService = jwtService;
        this.configService = configService;
        this.authService = authService;
    }
    async canActivate(context) {
        try {
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new common_1.UnauthorizedException('No token provided');
            }
            if (this.authService.isTokenBlacklisted(token)) {
                throw new common_1.UnauthorizedException('Token has been revoked');
            }
            const result = (await super.canActivate(context));
            return result;
        }
        catch (error) {
            console.error('Authentication error:', error);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type !== 'Bearer') {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        return token;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        admin_auth_service_1.AdminAuthService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map