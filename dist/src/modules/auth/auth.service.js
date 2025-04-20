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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const role_enum_1 = require("./enums/role.enum");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.blacklistedTokens = new Set();
    }
    async register(registerDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: registerDto.email },
                    { username: registerDto.username },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email or username already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
            },
        });
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            username: user.username,
            role: role_enum_1.Role.USER,
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                role: role_enum_1.Role.USER,
            },
        };
    }
    async login(loginDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: loginDto.email },
                    { username: loginDto.email },
                ],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
    async refreshToken(token) {
        try {
            if (this.blacklistedTokens.has(token)) {
                throw new common_1.UnauthorizedException('Token has been revoked');
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            this.blacklistedTokens.add(token);
            const newToken = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            });
            return {
                token: newToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    isTokenBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }
    async createAdmin(createAdminDto) {
        const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
        const admin = await this.prisma.user.create({
            data: {
                fullName: createAdminDto.fullName,
                username: createAdminDto.username,
                email: createAdminDto.email,
                password: hashedPassword,
                role: role_enum_1.Role.ADMIN,
            },
        });
        const { password, ...result } = admin;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map