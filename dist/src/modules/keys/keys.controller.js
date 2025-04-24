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
var KeysController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeysController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const keys_service_1 = require("./keys.service");
const create_key_dto_1 = require("./dto/create-key.dto");
const update_key_dto_1 = require("./dto/update-key.dto");
const find_keys_dto_1 = require("./dto/find-keys.dto");
const delete_bulk_keys_dto_1 = require("./dto/delete-bulk-keys.dto");
const jwt_auth_guard_1 = require("../admin-auth/guards/jwt-auth.guard");
let KeysController = KeysController_1 = class KeysController {
    constructor(keysService) {
        this.keysService = keysService;
        this.logger = new common_1.Logger(KeysController_1.name);
    }
    search(findKeysDto) {
        return this.keysService.search(findKeysDto);
    }
    findByActivationCode(activationCode) {
        return this.keysService.findByActivationCode(activationCode);
    }
    findByProductId(productId) {
        return this.keysService.findByProductId(productId);
    }
    findByUserId(userId) {
        return this.keysService.findByUserId(userId);
    }
    findByUserEmail(userEmail) {
        return this.keysService.findByUserEmail(userEmail);
    }
    findByOrderId(orderId) {
        return this.keysService.findByOrderId(orderId);
    }
    findAll() {
        return this.keysService.findAll();
    }
    findOne(id) {
        return this.keysService.findOne(id);
    }
    create(createKeyDto) {
        return this.keysService.create(createKeyDto);
    }
    update(id, updateKeyDto) {
        return this.keysService.update(id, updateKeyDto);
    }
    remove(id) {
        return this.keysService.remove(id);
    }
    async deleteBulk(deleteBulkKeysDto) {
        this.logger.debug(`Received request for POST /admin/keys/bulk with body: ${JSON.stringify(deleteBulkKeysDto)}`);
        const ids = deleteBulkKeysDto?.ids;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            this.logger.warn(`Manual Validation Failed: 'ids' is not a non-empty array.`);
            throw new common_1.BadRequestException(`Request body must contain a non-empty 'ids' array.`);
        }
        const invalidId = ids.find(id => !(0, class_validator_1.isUUID)(id, '4'));
        if (invalidId) {
            this.logger.warn(`Manual Validation Failed: Invalid UUID format found in ids array: ${invalidId}`);
            throw new common_1.BadRequestException(`Invalid UUID format found in ids array: ${invalidId}`);
        }
        const result = await this.keysService.deleteBulk(ids);
        this.logger.log(`Bulk delete result count: ${result.count}`);
        return { deletedCount: result.count };
    }
};
exports.KeysController = KeysController;
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_keys_dto_1.FindKeysDto]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('by-activation-code/:activationCode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('activationCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByActivationCode", null);
__decorate([
    (0, common_1.Get)('by-product/:productId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Get)('by-user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('by-email/:userEmail'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByUserEmail", null);
__decorate([
    (0, common_1.Get)('by-order/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByOrderId", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_key_dto_1.CreateKeyDto]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_key_dto_1.UpdateKeyDto]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_bulk_keys_dto_1.DeleteBulkKeysDto]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "deleteBulk", null);
exports.KeysController = KeysController = KeysController_1 = __decorate([
    (0, common_1.Controller)('admin/keys'),
    __metadata("design:paramtypes", [keys_service_1.KeysService])
], KeysController);
//# sourceMappingURL=keys.controller.js.map