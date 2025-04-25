"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const products_module_1 = require("./modules/products/products.module");
const users_module_1 = require("./modules/users/users.module");
const orders_module_1 = require("./modules/orders/orders.module");
const keys_module_1 = require("./modules/keys/keys.module");
const comments_module_1 = require("./modules/comments/comments.module");
const logs_module_1 = require("./modules/logs/logs.module");
const admin_module_1 = require("./modules/admin/admin.module");
const admin_auth_module_1 = require("./modules/admin-auth/admin-auth.module");
const client_auth_module_1 = require("./modules/client-auth/client-auth.module");
const categories_module_1 = require("./modules/categories/categories.module");
const upload_module_1 = require("./modules/upload/upload.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const import_sources_module_1 = require("./modules/import-sources/import-sources.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public'),
                serveRoot: '/',
            }),
            prisma_module_1.PrismaModule,
            products_module_1.ProductsModule,
            users_module_1.UsersModule,
            orders_module_1.OrdersModule,
            keys_module_1.KeysModule,
            comments_module_1.CommentsModule,
            logs_module_1.LogsModule,
            admin_module_1.AdminModule,
            admin_auth_module_1.AdminAuthModule,
            client_auth_module_1.ClientAuthModule,
            categories_module_1.CategoriesModule,
            upload_module_1.UploadModule,
            import_sources_module_1.ImportSourcesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map