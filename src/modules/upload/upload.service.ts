import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { randomBytes } from 'crypto';

// Thư mục lưu trữ ảnh đã xử lý
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
// Cấu hình xử lý ảnh
const IMAGE_MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

// Đảm bảo thư mục uploads tồn tại
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  private generateUniqueFilename(): string {
    const timestamp = Date.now();
    const randomString = randomBytes(8).toString('hex');
    return `${timestamp}-${randomString}.webp`; // Luôn là .webp
  }

  async processAndSaveImage(fileBuffer: Buffer): Promise<string> {
    const filename = this.generateUniqueFilename();
    const outputPath = join(UPLOAD_DIR, filename);

    this.logger.log(`Processing image, saving to: ${outputPath}`);

    try {
      await sharp(fileBuffer)
        .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true }) // Resize, không phóng to nếu nhỏ hơn
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      this.logger.log(`Successfully processed and saved image: ${filename}`);
      const publicUrl = `/uploads/${filename}`; // URL tương đối
      return publicUrl;
    } catch (error) {
      this.logger.error(`Failed to process image: ${error}`);
      // Xóa file nếu quá trình sharp bị lỗi và file đã được tạo một phần (ít khả năng nhưng chắc chắn)
      if (existsSync(outputPath)) {
        try {
          await fs.unlink(outputPath);
        } catch (cleanupError) {
          this.logger.error(`Failed to cleanup partially created file ${outputPath}: ${cleanupError}`);
        }
      }
      throw new InternalServerErrorException('Could not process image.');
    }
  }
} 