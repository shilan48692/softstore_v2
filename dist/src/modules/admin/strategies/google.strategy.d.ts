import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../admin.service';
declare const GoogleAdminStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleAdminStrategy extends GoogleAdminStrategy_base {
    private configService;
    private adminService;
    constructor(configService: ConfigService, adminService: AdminService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
