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
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const google_auth_library_1 = require("google-auth-library");
function parseExpiresIn(expiresIn) {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);
    if (isNaN(value))
        return 24 * 60 * 60 * 1000;
    switch (unit) {
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'm': return value * 60 * 1000;
        case 's': return value * 1000;
        default: return 24 * 60 * 60 * 1000;
    }
}
let AdminAuthController = class AdminAuthController {
    constructor(adminAuthService, configService) {
        this.adminAuthService = adminAuthService;
        this.configService = configService;
        this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'), this.configService.get('GOOGLE_CLIENT_SECRET'), 'postmessage');
    }
    async googleLogin(code, response) {
        if (!code) {
            throw new common_1.UnauthorizedException('No authorization code provided');
        }
        try {
            console.log('Received code from frontend:', code ? code.substring(0, 10) + '...' : 'null');
            const { tokens } = await this.googleClient.getToken(code);
            console.log('Received tokens from Google');
            const id_token = tokens.id_token;
            if (!id_token) {
                console.log('No id_token received from Google');
                throw new common_1.UnauthorizedException('Failed to get ID token from Google');
            }
            const ticket = await this.googleClient.verifyIdToken({
                idToken: id_token,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();
            console.log('Google ID Token Payload:', payload);
            if (!payload || !payload.email) {
                console.log('Invalid ID token payload or missing email');
                throw new common_1.UnauthorizedException('Invalid ID token from Google');
            }
            const emailFromGoogle = payload.email;
            const normalizedEmail = emailFromGoogle.toLowerCase();
            console.log(`Normalized email for lookup: ${normalizedEmail}`);
            const admin = await this.adminAuthService.findAdminByEmail(normalizedEmail);
            if (!admin) {
                console.log('Admin email not found:', normalizedEmail);
                throw new common_1.UnauthorizedException('Admin account not found for this email');
            }
            const jwtPayload = { sub: admin.id, email: admin.email, role: admin.role };
            console.log('JWT token payload:', jwtPayload);
            const accessToken = await this.adminAuthService.createToken(jwtPayload);
            console.log('Generated access token: ey...');
            const expiresInString = this.configService.get('JWT_EXPIRES_IN', '1d');
            const maxAge = parseExpiresIn(expiresInString);
            response.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: this.configService.get('NODE_ENV') === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: maxAge,
            });
            const { password, ...adminInfo } = admin;
            return { admin: adminInfo };
        }
        catch (error) {
            console.error('Error during Google code exchange/login:', error.response?.data || error.message);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            if (error.response?.data?.error === 'invalid_grant') {
                throw new common_1.UnauthorizedException('Invalid or expired authorization code.');
            }
            throw new common_1.UnauthorizedException('Google authentication failed');
        }
    }
    async logout(response) {
        response.clearCookie('accessToken', {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
            path: '/',
        });
        return { message: 'Admin logged out successfully' };
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('google/login'),
    __param(0, (0, common_1.Body)('code')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "logout", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService,
        config_1.ConfigService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map