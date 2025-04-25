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
exports.AdminService = exports.AdminRole = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
exports.AdminRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
};
let AdminService = class AdminService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const admin = await this.prisma.admin.findUnique({
            where: { email: loginDto.email },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({
            sub: admin.id,
            email: admin.email,
            role: admin.role,
        });
        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        };
    }
    async validateAdminEmail(email) {
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });
        return !!admin;
    }
    async createAdmin(data) {
        const result = await this.prisma.admin.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                googleId: data.googleId,
                role: data.role || exports.AdminRole.ADMIN,
            },
        });
        return {
            id: result.id,
            email: result.email,
            password: result.password,
            name: result.name,
            role: result.role,
            googleId: result.googleId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
    async findAdminByEmail(email) {
        const result = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (!result)
            return null;
        return {
            id: result.id,
            email: result.email,
            password: result.password,
            name: result.name,
            role: result.role,
            googleId: result.googleId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
    async findAdminByGoogleId(googleId) {
        const result = await this.prisma.admin.findUnique({
            where: { googleId },
        });
        if (!result)
            return null;
        return {
            id: result.id,
            email: result.email,
            password: result.password,
            name: result.name,
            role: result.role,
            googleId: result.googleId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
    async getAdminRole(adminId) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: parseInt(adminId, 10) },
            select: { role: true },
        });
        return (admin?.role || exports.AdminRole.ADMIN);
    }
    async isSuperAdmin(adminId) {
        const role = await this.getAdminRole(adminId);
        return role === exports.AdminRole.SUPER_ADMIN;
    }
    async isAdmin(adminId) {
        const role = await this.getAdminRole(adminId);
        return role === exports.AdminRole.ADMIN || role === exports.AdminRole.SUPER_ADMIN;
    }
    async isModerator(adminId) {
        const role = await this.getAdminRole(adminId);
        return role === exports.AdminRole.MODERATOR || role === exports.AdminRole.ADMIN || role === exports.AdminRole.SUPER_ADMIN;
    }
    async countAdmins() {
        return this.prisma.admin.count();
    }
    async findAll(params) {
        const { select, where, orderBy } = params || {};
        const results = await this.prisma.admin.findMany({
            select,
            where,
            orderBy,
        });
        return results.map(result => ({
            id: result.id,
            email: result.email,
            password: result.password,
            name: result.name,
            role: result.role,
            googleId: result.googleId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        }));
    }
    async findOne(params) {
        const { select, where } = params;
        const admin = await this.prisma.admin.findUnique({
            select,
            where,
        });
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        return {
            id: admin.id,
            email: admin.email,
            password: admin.password,
            name: admin.name,
            role: admin.role,
            googleId: admin.googleId,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        };
    }
    async update(params) {
        const { where, data, select } = params;
        const result = await this.prisma.admin.update({
            data,
            where,
            select,
        });
        return {
            id: result.id,
            email: result.email,
            password: result.password,
            name: result.name,
            role: result.role,
            googleId: result.googleId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admin.service.js.map