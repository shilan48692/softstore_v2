import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ClientLoginDto } from './dto/client-login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
export declare class ClientAuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private generateRandomPassword;
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: ClientLoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            picture: any;
        };
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            picture: string;
        };
    }>;
}
