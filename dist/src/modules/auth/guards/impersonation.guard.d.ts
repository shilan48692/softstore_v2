import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ImpersonationService } from '../../impersonation/impersonation.service';
export declare class ImpersonationGuard implements CanActivate {
    private readonly impersonationService;
    constructor(impersonationService: ImpersonationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
