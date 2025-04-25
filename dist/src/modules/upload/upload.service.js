"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const sharp_1 = require("sharp");
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const UPLOAD_DIR = (0, path_1.join)(process.cwd(), 'public', 'uploads');
const IMAGE_MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
if (!(0, fs_1.existsSync)(UPLOAD_DIR)) {
    (0, fs_1.mkdirSync)(UPLOAD_DIR, { recursive: true });
}
let UploadService = UploadService_1 = class UploadService {
    constructor() {
        this.logger = new common_1.Logger(UploadService_1.name);
    }
    generateUniqueFilename() {
        const timestamp = Date.now();
        const randomString = (0, crypto_1.randomBytes)(8).toString('hex');
        return `${timestamp}-${randomString}.webp`;
    }
    async processAndSaveImage(fileBuffer) {
        const filename = this.generateUniqueFilename();
        const outputPath = (0, path_1.join)(UPLOAD_DIR, filename);
        this.logger.log(`Processing image, saving to: ${outputPath}`);
        try {
            await (0, sharp_1.default)(fileBuffer)
                .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: WEBP_QUALITY })
                .toFile(outputPath);
            this.logger.log(`Successfully processed and saved image: ${filename}`);
            const publicUrl = `/uploads/${filename}`;
            return publicUrl;
        }
        catch (error) {
            this.logger.error(`Failed to process image: ${error}`);
            if ((0, fs_1.existsSync)(outputPath)) {
                try {
                    await fs_1.promises.unlink(outputPath);
                }
                catch (cleanupError) {
                    this.logger.error(`Failed to cleanup partially created file ${outputPath}: ${cleanupError}`);
                }
            }
            throw new common_1.InternalServerErrorException('Could not process image.');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map