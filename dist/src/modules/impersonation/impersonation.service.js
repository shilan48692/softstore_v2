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
exports.ImpersonationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let ImpersonationService = class ImpersonationService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async impersonateUser(adminId, userId) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const impersonationToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            username: user.username,
            isImpersonated: true,
            impersonatedBy: adminId,
        }, {
            expiresIn: this.configService.get('IMPERSONATION_TOKEN_EXPIRY') || '1h',
        });
        await this.prisma.impersonationLog.create({
            data: {
                adminId,
                userId,
                token: impersonationToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            },
        });
        return {
            token: impersonationToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
            },
        };
    }
    async validateImpersonationToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            if (!payload.isImpersonated) {
                throw new common_1.UnauthorizedException('Invalid impersonation token');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (!user.isActive) {
                throw new common_1.UnauthorizedException('User account is inactive');
            }
            return {
                userId: user.id,
                email: user.email,
                username: user.username,
                isImpersonated: true,
                impersonatedBy: payload.impersonatedBy,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired impersonation token');
        }
    }
    async endImpersonation(token) {
        try {
            const payload = this.jwtService.verify(token);
            if (!payload.isImpersonated) {
                throw new common_1.UnauthorizedException('Not an impersonation token');
            }
            return { success: true };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.ImpersonationService = ImpersonationService;
exports.ImpersonationService = ImpersonationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ImpersonationService);
//# sourceMappingURL=impersonation.service.js.map