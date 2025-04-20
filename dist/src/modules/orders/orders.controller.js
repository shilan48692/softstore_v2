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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const find_orders_dto_1 = require("./dto/find-orders.dto");
const order_status_enum_1 = require("./enums/order-status.enum");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(createOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
    findAll(query) {
        return this.ordersService.findAll({
            skip: query.page ? (query.page - 1) * (query.limit || 10) : undefined,
            take: query.limit,
            where: {
                userId: query.userId,
                status: query.status,
                startDate: query.startDate ? new Date(query.startDate) : undefined,
                endDate: query.endDate ? new Date(query.endDate) : undefined,
            },
        });
    }
    search(findOrdersDto) {
        return this.ordersService.search(findOrdersDto);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    findByUserId(userId) {
        return this.ordersService.findByUserId(userId);
    }
    findByUserEmail(userEmail) {
        return this.ordersService.findByUserEmail(userEmail);
    }
    update(id, updateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }
    updateStatus(id, status, updatedBy, note) {
        return this.ordersService.updateStatus(id, status, updatedBy, note);
    }
    remove(id) {
        return this.ordersService.remove(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_orders_dto_1.FindOrdersDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_orders_dto_1.FindOrdersDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('email/:userEmail'),
    __param(0, (0, common_1.Param)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findByUserEmail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('updatedBy')),
    __param(3, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map