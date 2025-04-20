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
exports.ImpersonationController = void 0;
const common_1 = require("@nestjs/common");
const impersonation_service_1 = require("./impersonation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const impersonate_dto_1 = require("./dto/impersonate.dto");
let ImpersonationController = class ImpersonationController {
    constructor(impersonationService) {
        this.impersonationService = impersonationService;
    }
    async impersonateUser(impersonateDto, req) {
        const adminId = req.user.id;
        return this.impersonationService.impersonateUser(adminId, impersonateDto.userId);
    }
    async validateToken(token) {
        return this.impersonationService.validateImpersonationToken(token);
    }
    async endImpersonation(token) {
        return this.impersonationService.endImpersonation(token);
    }
};
exports.ImpersonationController = ImpersonationController;
__decorate([
    (0, common_1.Post)('impersonate'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [impersonate_dto_1.ImpersonateDto, Object]),
    __metadata("design:returntype", Promise)
], ImpersonationController.prototype, "impersonateUser", null);
__decorate([
    (0, common_1.Post)('validate'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImpersonationController.prototype, "validateToken", null);
__decorate([
    (0, common_1.Post)('end'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImpersonationController.prototype, "endImpersonation", null);
exports.ImpersonationController = ImpersonationController = __decorate([
    (0, common_1.Controller)('impersonation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [impersonation_service_1.ImpersonationService])
], ImpersonationController);
//# sourceMappingURL=impersonation.controller.js.map