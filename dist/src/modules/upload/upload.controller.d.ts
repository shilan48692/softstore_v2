import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    private readonly logger;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
