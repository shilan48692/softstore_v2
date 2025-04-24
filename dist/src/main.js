"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const error_interceptor_1 = require("./common/interceptors/error.interceptor");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const trim_pipe_1 = require("./common/pipes/trim.pipe");
const cookieParser = require("cookie-parser");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use(cookieParser());
    app.useGlobalPipes(new trim_pipe_1.TrimPipe());
    app.useGlobalInterceptors(new error_interceptor_1.ErrorInterceptor());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const allowedOrigins = configService.get('CORS_ALLOWED_ORIGINS');
    if (!allowedOrigins) {
        common_1.Logger.warn('CORS_ALLOWED_ORIGINS is not defined in environment variables. CORS might not work as expected.', 'Bootstrap');
    }
    const origins = allowedOrigins ? allowedOrigins.split(',').map(origin => origin.trim()) : [];
    app.enableCors({
        origin: origins.length > 0 ? origins : true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: [
            'Accept',
            'Content-Type',
            'Authorization',
            'X-Requested-With',
        ],
        credentials: true,
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    common_1.Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map