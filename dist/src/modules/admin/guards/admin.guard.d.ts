import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';
export declare class AdminGuard implements CanActivate {
    private jwtService;
    private adminService;
    constructor(jwtService: JwtService, adminService: AdminService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
