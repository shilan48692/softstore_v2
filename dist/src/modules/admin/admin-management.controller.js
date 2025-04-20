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
exports.AdminManagementController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
let AdminManagementController = class AdminManagementController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAllAdmins() {
        return this.adminService.findAll({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async createAdmin(data) {
        return this.adminService.createAdmin(data);
    }
    async getAdmin(id) {
        return this.adminService.findOne({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async updateAdminRole(id, data) {
        return this.adminService.update({
            where: { id },
            data: { role: data.role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }
};
exports.AdminManagementController = AdminManagementController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "updateAdminRole", null);
exports.AdminManagementController = AdminManagementController = __decorate([
    (0, common_1.Controller)('admin/management'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminManagementController);
//# sourceMappingURL=admin-management.controller.js.map