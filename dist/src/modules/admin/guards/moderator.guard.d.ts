import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';
export declare class ModeratorGuard implements CanActivate {
    private jwtService;
    private adminService;
    constructor(jwtService: JwtService, adminService: AdminService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
