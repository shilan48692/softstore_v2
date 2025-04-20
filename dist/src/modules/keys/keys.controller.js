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
exports.KeysController = void 0;
const common_1 = require("@nestjs/common");
const keys_service_1 = require("./keys.service");
const create_key_dto_1 = require("./dto/create-key.dto");
const update_key_dto_1 = require("./dto/update-key.dto");
const find_keys_dto_1 = require("./dto/find-keys.dto");
let KeysController = class KeysController {
    constructor(keysService) {
        this.keysService = keysService;
    }
    create(createKeyDto) {
        return this.keysService.create(createKeyDto);
    }
    findAll() {
        return this.keysService.findAll();
    }
    findOne(id) {
        return this.keysService.findOne(id);
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
    search(findKeysDto) {
        return this.keysService.search(findKeysDto);
    }
    update(id, updateKeyDto) {
        return this.keysService.update(id, updateKeyDto);
    }
    remove(id) {
        return this.keysService.remove(id);
    }
};
exports.KeysController = KeysController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_key_dto_1.CreateKeyDto]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('by-activation-code/:activationCode'),
    __param(0, (0, common_1.Param)('activationCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByActivationCode", null);
__decorate([
    (0, common_1.Get)('by-product/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Get)('by-user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('by-email/:userEmail'),
    __param(0, (0, common_1.Param)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByUserEmail", null);
__decorate([
    (0, common_1.Get)('by-order/:orderId'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "findByOrderId", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_keys_dto_1.FindKeysDto]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "search", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_key_dto_1.UpdateKeyDto]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeysController.prototype, "remove", null);
exports.KeysController = KeysController = __decorate([
    (0, common_1.Controller)('keys'),
    __metadata("design:paramtypes", [keys_service_1.KeysService])
], KeysController);
//# sourceMappingURL=keys.controller.js.map