import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    login(loginDto: AdminLoginDto): Promise<{
        token: string;
        admin: {
            id: string;
            email: string;
            fullName: string;
            role: import("../auth/enums/role.enum").Role;
        };
    }>;
}
