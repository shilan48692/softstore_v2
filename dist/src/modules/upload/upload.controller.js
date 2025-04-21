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
var UploadController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../admin-auth/guards/jwt-auth.guard");
const upload_service_1 = require("./upload.service");
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES_REGEX = /\/(jpg|jpeg|png|gif)$/;
let UploadController = UploadController_1 = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
        this.logger = new common_1.Logger(UploadController_1.name);
    }
    async uploadFile(file) {
        this.logger.log(`Received file upload request: ${file?.originalname}, size: ${file?.size}, mimetype: ${file?.mimetype}`);
        if (!file) {
            this.logger.error('No file received in controller, though interceptor should have caught it.');
            throw new common_1.BadRequestException('No file uploaded or file rejected by filter.');
        }
        try {
            const fileBuffer = file.buffer;
            const publicUrl = await this.uploadService.processAndSaveImage(fileBuffer);
            this.logger.log(`File processed successfully. URL: ${publicUrl}`);
            return { url: publicUrl };
        }
        catch (error) {
            this.logger.error(`Error processing file ${file.originalname} in service: ${error}`);
            if (error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Could not process uploaded file.');
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: MAX_FILE_SIZE_BYTES,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(ALLOWED_MIME_TYPES_REGEX)) {
                return cb(new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}. Only JPG, PNG, GIF are allowed.`), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
exports.UploadController = UploadController = UploadController_1 = __decorate([
    (0, common_1.Controller)('api/upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map