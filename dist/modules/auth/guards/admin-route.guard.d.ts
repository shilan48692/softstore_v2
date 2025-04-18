import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
export declare class AdminRouteGuard implements CanActivate {
    private configService;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
