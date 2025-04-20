"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const client_auth_service_1 = require("./client-auth.service");
const client_auth_controller_1 = require("./client-auth.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const users_module_1 = require("../users/users.module");
const google_strategy_1 = require("./strategies/google.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let ClientAuthModule = class ClientAuthModule {
};
exports.ClientAuthModule = ClientAuthModule;
exports.ClientAuthModule = ClientAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_CLIENT_SECRET || 'client-secret-key',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [client_auth_controller_1.ClientAuthController],
        providers: [client_auth_service_1.ClientAuthService, google_strategy_1.GoogleStrategy, jwt_strategy_1.JwtStrategy],
        exports: [client_auth_service_1.ClientAuthService],
    })
], ClientAuthModule);
//# sourceMappingURL=client-auth.module.js.map