export declare class UploadService {
    private readonly logger;
    private generateUniqueFilename;
    processAndSaveImage(fileBuffer: Buffer): Promise<string>;
}
