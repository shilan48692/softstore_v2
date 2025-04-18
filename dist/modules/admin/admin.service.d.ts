import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Role } from '../auth/enums/role.enum';
export declare class AdminService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: AdminLoginDto): Promise<{
        token: string;
        admin: {
            id: string;
            email: string;
            fullName: string;
            role: Role;
        };
    }>;
}
