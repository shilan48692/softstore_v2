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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const admin_service_1 = require("./admin.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    constructor(adminService, jwtService, configService) {
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async googleAuth() {
    }
    async googleAuthCallback(req, res) {
        const user = req.user;
        let admin = await this.adminService.findAdminByEmail(user.email);
        if (!admin) {
            const isFirstAdmin = await this.isFirstAdmin();
            const role = isFirstAdmin ? client_1.AdminRole.SUPER_ADMIN : client_1.AdminRole.ADMIN;
            admin = await this.adminService.createAdmin({
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                googleId: user.googleId,
                role,
            });
        }
        const token = this.jwtService.sign({
            sub: admin.id,
            email: admin.email,
            role: admin.role,
        });
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(this.configService.get('ADMIN_FRONTEND_URL', 'http://localhost:3001'));
    }
    getProfile(req) {
        return req.user;
    }
    logout(res) {
        res.clearCookie('admin_token');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    async isFirstAdmin() {
        const count = await this.adminService.countAdmins();
        return count === 0;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('login/google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google-admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('login/google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google-admin')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "logout", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map