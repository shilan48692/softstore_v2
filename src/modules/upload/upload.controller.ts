import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  PayloadTooLargeException,
  InternalServerErrorException,
  Logger,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Correct import for Express
import { memoryStorage } from 'multer'; // Use memoryStorage to handle file in buffer
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'; // Assuming this is the correct path
import { UploadService } from './upload.service';

// --- Configuration --- (Moved Service-specific config to service)
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES_REGEX = /\/(jpg|jpeg|png|gif)$/;

@Controller('api/upload') // Route prefix
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  // Inject UploadService
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Set default success code to 201
  @UseGuards(JwtAuthGuard) // Require admin JWT authentication
  @UseInterceptors(FileInterceptor('file', { // 'file' is the field name in FormData
    storage: memoryStorage(), // Store file in memory buffer
    limits: {
      fileSize: MAX_FILE_SIZE_BYTES, // Apply size limit via Multer
    },
    fileFilter: (req, file, cb) => {
      // Check MIME type
      if (!file.mimetype.match(ALLOWED_MIME_TYPES_REGEX)) {
        // Reject file with a specific error for unsupported type
        return cb(new BadRequestException(`Unsupported file type: ${file.mimetype}. Only JPG, PNG, GIF are allowed.`), false);
      }
      // Accept file
      cb(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) { // Use Express.Multer.File type
    this.logger.log(`Received file upload request: ${file?.originalname}, size: ${file?.size}, mimetype: ${file?.mimetype}`);

    // Basic check if file exists (Multer/Interceptor handles most errors)
    if (!file) {
      // This case might be rare if interceptor is correctly configured
      this.logger.error('No file received in controller, though interceptor should have caught it.');
      throw new BadRequestException('No file uploaded or file rejected by filter.');
    }

    // Multer might throw PayloadTooLargeException if limits.fileSize is exceeded
    // fileFilter throws BadRequestException for wrong type

    // Process the file using UploadService
    try {
      const fileBuffer = file.buffer;
      const publicUrl = await this.uploadService.processAndSaveImage(fileBuffer);
      this.logger.log(`File processed successfully. URL: ${publicUrl}`);
      return { url: publicUrl }; // Return 201 Created with the URL
    } catch (error) {
      // Log service errors (already logged in service, but good to know context here)
      this.logger.error(`Error processing file ${file.originalname} in service: ${error}`);

      // Re-throw internal server errors from the service
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      // Throw a generic server error for other unexpected issues
      throw new InternalServerErrorException('Could not process uploaded file.');
    }
  }
} 