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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_service_1 = require("./admin-auth.service");
const google_auth_library_1 = require("google-auth-library");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminAuthController = class AdminAuthController {
    constructor(adminAuthService, prisma) {
        this.adminAuthService = adminAuthService;
        this.prisma = prisma;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
        console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    }
    async googleLogin(code) {
        try {
            console.log('Received code:', code);
            const { tokens } = await this.googleClient.getToken(code);
            console.log('Received tokens from Google');
            const { id_token } = tokens;
            if (!id_token) {
                console.log('No id_token in response');
                throw new common_1.UnauthorizedException('Invalid code');
            }
            const ticket = await this.googleClient.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            console.log('Google token payload:', payload);
            if (!payload) {
                console.log('Invalid token payload');
                throw new common_1.UnauthorizedException('Invalid token payload');
            }
            const { email } = payload;
            console.log('Email from token:', email);
            const admin = await this.prisma.admin.findUnique({
                where: { email }
            });
            console.log('Found admin:', admin);
            if (!admin) {
                console.log('Email not found in admin list');
                throw new common_1.UnauthorizedException('Email not found in admin list');
            }
            if (!admin.googleId) {
                console.log('Updating googleId for admin');
                await this.prisma.admin.update({
                    where: { id: admin.id },
                    data: { googleId: payload.sub }
                });
            }
            const tokenPayload = {
                sub: admin.id,
                email: admin.email,
                role: admin.role
            };
            console.log('JWT token payload:', tokenPayload);
            const accessToken = await this.adminAuthService.createToken(tokenPayload);
            console.log('Generated access token:', accessToken);
            return {
                accessToken,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                }
            };
        }
        catch (error) {
            console.error('Error during Google login:', error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid code');
        }
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('google/login'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "googleLogin", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService,
        prisma_service_1.PrismaService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map