"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const path_1 = require("path");
const fs_1 = require("fs");
const sharp_1 = require("sharp");
const formidable_1 = require("formidable");
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_1 = require("crypto");
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const UPLOAD_DIR = (0, path_1.join)(process.cwd(), 'public', 'uploads');
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif'];
const IMAGE_MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_VERY_SECRET_KEY';
if (!(0, fs_1.existsSync)(UPLOAD_DIR)) {
    (0, fs_1.mkdirSync)(UPLOAD_DIR, { recursive: true });
}
exports.config = {
    api: {
        bodyParser: false,
    },
};
const generateUniqueFilename = (extension = 'webp') => {
    const timestamp = Date.now();
    const randomString = (0, crypto_1.randomBytes)(8).toString('hex');
    return `${timestamp}-${randomString}.${extension}`;
};
const verifyJwt = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject('No token provided');
        }
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not defined. Please set it in your environment variables.');
            return reject('JWT secret not configured');
        }
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err.message);
                return reject('Invalid token');
            }
            resolve(decoded);
        });
    });
};
async function POST(req) {
    console.log('Received POST request to /api/upload');
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    try {
        await verifyJwt(token);
        console.log('JWT authentication successful');
    }
    catch (error) {
        console.error('JWT authentication failed:', error);
        const message = error === 'Invalid token' || error === 'No token provided' ? 'Unauthorized' : 'Authentication error';
        return server_1.NextResponse.json({ message }, { status: 401 });
    }
    const form = (0, formidable_1.default)({
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        maxFileSize: MAX_FILE_SIZE_BYTES,
        filter: ({ name, originalFilename, mimetype }) => {
            const isAllowedMime = !!mimetype && ALLOWED_MIMETYPES.includes(mimetype);
            if (name === 'file' && !isAllowedMime) {
                console.log(`Rejected file due to unsupported mimetype: ${mimetype}`);
            }
            return name === 'file' && isAllowedMime;
        },
    });
    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Formidable parsing error:', err);
                    if (err.code === 1009 || (err.message && err.message.includes('maxFileSize'))) {
                        reject(new Error('LIMIT_FILE_SIZE'));
                    }
                    else {
                        reject(err);
                    }
                    return;
                }
                resolve([fields, files]);
            });
        });
        const uploadedFileArray = files.file;
        const uploadedFile = Array.isArray(uploadedFileArray) ? uploadedFileArray[0] : uploadedFileArray;
        if (!uploadedFile || !uploadedFile.filepath) {
            console.log('No valid file uploaded, incorrect field name, or unsupported file type.');
            if (uploadedFile && uploadedFile.filepath && (0, fs_1.existsSync)(uploadedFile.filepath)) {
                await fs_1.promises.unlink(uploadedFile.filepath);
            }
            return server_1.NextResponse.json({ message: 'No file uploaded or invalid file type.' }, { status: 400 });
        }
        console.log(`Temporary file received: ${uploadedFile.filepath}`);
        const tempFilePath = uploadedFile.filepath;
        const finalFilename = generateUniqueFilename('webp');
        const finalOutputPath = (0, path_1.join)(UPLOAD_DIR, finalFilename);
        console.log(`Processing image: resizing to max width ${IMAGE_MAX_WIDTH}, converting to WEBP (quality ${WEBP_QUALITY})`);
        try {
            await (0, sharp_1.default)(tempFilePath)
                .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: WEBP_QUALITY })
                .toFile(finalOutputPath);
            console.log(`Image processed and saved to: ${finalOutputPath}`);
        }
        catch (sharpError) {
            console.error('Sharp processing error:', sharpError);
            if ((0, fs_1.existsSync)(tempFilePath)) {
                await fs_1.promises.unlink(tempFilePath);
            }
            throw new Error('Image processing failed');
        }
        if ((0, fs_1.existsSync)(tempFilePath)) {
            await fs_1.promises.unlink(tempFilePath);
            console.log(`Temporary file deleted: ${tempFilePath}`);
        }
        const publicUrl = `/uploads/${finalFilename}`;
        return server_1.NextResponse.json({ url: publicUrl }, { status: 201 });
    }
    catch (error) {
        console.error('Error processing upload:', error);
        if (error.message === 'LIMIT_FILE_SIZE') {
            return server_1.NextResponse.json({ message: 'File too large.' }, { status: 413 });
        }
        if (error.message === 'Image processing failed') {
            return server_1.NextResponse.json({ message: 'Failed to process image.' }, { status: 500 });
        }
        return server_1.NextResponse.json({ message: 'Internal Server Error processing file.' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map