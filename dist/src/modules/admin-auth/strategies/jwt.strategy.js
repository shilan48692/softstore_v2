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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cookieExtractor = (request) => {
    let token = null;
    if (request && request.cookies) {
        token = request.cookies['accessToken'];
    }
    return token;
};
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-admin') {
    constructor(configService) {
        const secret = configService.get('JWT_ADMIN_SECRET');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                cookieExtractor,
            ]),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
        this.configService = configService;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
        this.logger.debug(`Initializing Admin JwtStrategy with secret: ${secret ? 'Loaded' : 'UNDEFINED'}`);
        if (!secret) {
            this.logger.error('JWT_ADMIN_SECRET is not defined for Admin JwtStrategy!');
            throw new Error('JWT_ADMIN_SECRET is not defined in environment variables for Admin JwtStrategy');
        }
    }
    async validate(payload) {
        if (!payload || !payload.sub || !payload.email || !payload.role) {
            this.logger.warn('Invalid JWT payload structure received', payload);
            return null;
        }
        return {
            email: payload.email,
            role: payload.role
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map