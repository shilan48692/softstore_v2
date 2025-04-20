import { ImpersonationService } from './impersonation.service';
import { ImpersonateDto } from './dto/impersonate.dto';
export declare class ImpersonationController {
    private readonly impersonationService;
    constructor(impersonationService: ImpersonationService);
    impersonateUser(impersonateDto: ImpersonateDto, req: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
        };
    }>;
    validateToken(token: string): Promise<{
        userId: string;
        email: string;
        username: string;
        isImpersonated: boolean;
        impersonatedBy: any;
    }>;
    endImpersonation(token: string): Promise<{
        success: boolean;
    }>;
}
