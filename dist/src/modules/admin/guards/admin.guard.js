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
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_service_1 = require("../admin.service");
let AdminGuard = class AdminGuard {
    constructor(jwtService, adminService) {
        this.jwtService = jwtService;
        this.adminService = adminService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['admin_token'];
        if (!token) {
            throw new common_1.UnauthorizedException('Unauthorized: No token found');
        }
        try {
            const payload = this.jwtService.verify(token);
            if (!payload.role) {
                throw new common_1.UnauthorizedException('Unauthorized: No role found');
            }
            request.user = payload;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unauthorized: Invalid token');
        }
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        admin_service_1.AdminService])
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map