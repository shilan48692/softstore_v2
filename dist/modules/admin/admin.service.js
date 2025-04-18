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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const role_enum_1 = require("../auth/enums/role.enum");
let AdminService = class AdminService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const admin = await this.prisma.user.findFirst({
            where: {
                email: loginDto.email,
                role: role_enum_1.Role.ADMIN,
            },
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
            role: role_enum_1.Role.ADMIN,
        });
        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                role: role_enum_1.Role.ADMIN,
            },
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