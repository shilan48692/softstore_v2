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
exports.ImportSourcesController = void 0;
const common_1 = require("@nestjs/common");
const import_sources_service_1 = require("./import-sources.service");
const create_import_source_dto_1 = require("./dto/create-import-source.dto");
const update_import_source_dto_1 = require("./dto/update-import-source.dto");
const find_import_sources_dto_1 = require("./dto/find-import-sources.dto");
const jwt_auth_guard_1 = require("../admin-auth/guards/jwt-auth.guard");
let ImportSourcesController = class ImportSourcesController {
    constructor(importSourcesService) {
        this.importSourcesService = importSourcesService;
    }
    create(createImportSourceDto) {
        return this.importSourcesService.create(createImportSourceDto);
    }
    search(findImportSourcesDto) {
        return this.importSourcesService.search(findImportSourcesDto);
    }
    findAll() {
        return this.importSourcesService.findAll();
    }
    findOne(id) {
        return this.importSourcesService.findOne(id);
    }
    update(id, updateImportSourceDto) {
        return this.importSourcesService.update(id, updateImportSourceDto);
    }
    remove(id) {
        return this.importSourcesService.remove(id);
    }
};
exports.ImportSourcesController = ImportSourcesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_import_source_dto_1.CreateImportSourceDto]),
    __metadata("design:returntype", void 0)
], ImportSourcesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_import_sources_dto_1.FindImportSourcesDto]),
    __metadata("design:returntype", void 0)
], ImportSourcesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImportSourcesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImportSourcesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_import_source_dto_1.UpdateImportSourceDto]),
    __metadata("design:returntype", void 0)
], ImportSourcesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImportSourcesController.prototype, "remove", null);
exports.ImportSourcesController = ImportSourcesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('admin/import-sources'),
    __metadata("design:paramtypes", [import_sources_service_1.ImportSourcesService])
], ImportSourcesController);
//# sourceMappingURL=import-sources.controller.js.map