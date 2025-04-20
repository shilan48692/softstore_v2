import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AdminController {
    private readonly adminService;
    private readonly jwtService;
    private readonly configService;
    constructor(adminService: AdminService, jwtService: JwtService, configService: ConfigService);
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
    getProfile(req: any): any;
    logout(res: Response): Response<any, Record<string, any>>;
    private isFirstAdmin;
}
