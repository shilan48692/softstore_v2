"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const error_interceptor_1 = require("./common/interceptors/error.interceptor");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new error_interceptor_1.ErrorInterceptor());
    app.use(cookieParser());
    app.enableCors({
        origin: ['http://localhost:8080', process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: '*',
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map