import { ClientAuthService } from './client-auth.service';
import { ClientLoginDto } from './dto/client-login.dto';
import { Response } from 'express';
export declare class ClientAuthController {
    private readonly clientAuthService;
    constructor(clientAuthService: ClientAuthService);
    login(loginDto: ClientLoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            picture: any;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
    getProfile(req: any): any;
}
