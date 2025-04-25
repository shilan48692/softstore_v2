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
var ProductsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const admin_find_products_dto_1 = require("./dto/admin-find-products.dto");
const jwt_auth_guard_1 = require("../admin-auth/guards/jwt-auth.guard");
let ProductsController = ProductsController_1 = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
        this.logger = new common_1.Logger(ProductsController_1.name);
    }
    async findAll(query) {
        return await this.productsService.findAll(query);
    }
    async findOne(id) {
        return await this.productsService.findOne(id);
    }
    findBySlug(slug) {
        return this.productsService.findBySlug(slug);
    }
    findBySlugRoot(slug) {
        return this.productsService.findBySlug(slug);
    }
    async create(createProductDto) {
        return await this.productsService.create(createProductDto);
    }
    async update(id, updateProductDto) {
        this.logger.log(`Received request to update product with ID: ${id}`);
        return await this.productsService.update(id, updateProductDto);
    }
    async remove(id) {
        this.logger.log(`Received request to remove product with ID: ${id}`);
        return await this.productsService.remove(id);
    }
    search(query) {
        this.logger.log(`Received admin product search request with query: ${JSON.stringify(query)}`);
        return this.productsService.search(query);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('products'),
    (0, common_1.Header)('Cache-Control', 'no-cache'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, common_1.Header)('Cache-Control', 'no-cache'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('products/by-slug/:slug'),
    (0, common_1.Header)('Cache-Control', 'no-cache'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, common_1.Header)('Cache-Control', 'no-cache'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findBySlugRoot", null);
__decorate([
    (0, common_1.Post)('admin/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('admin/products/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/products/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('admin/products/search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_find_products_dto_1.AdminFindProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "search", null);
exports.ProductsController = ProductsController = ProductsController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map