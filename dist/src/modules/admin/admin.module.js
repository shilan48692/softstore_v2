"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const admin_management_controller_1 = require("./admin-management.controller");
const admin_service_1 = require("./admin.service");
const google_admin_strategy_1 = require("./strategies/google-admin.strategy");
const admin_guard_1 = require("./guards/admin.guard");
const super_admin_guard_1 = require("./guards/super-admin.guard");
const moderator_guard_1 = require("./guards/moderator.guard");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../../prisma/prisma.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [admin_controller_1.AdminController, admin_management_controller_1.AdminManagementController],
        providers: [
            admin_service_1.AdminService,
            google_admin_strategy_1.GoogleAdminStrategy,
            admin_guard_1.AdminGuard,
            super_admin_guard_1.SuperAdminGuard,
            moderator_guard_1.ModeratorGuard
        ],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map