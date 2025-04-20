import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AdminService, AdminRole } from '../admin.service';

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Kiểm tra token từ cookie
    const token = request.cookies['admin_token'];
    
    if (!token) {
      throw new UnauthorizedException('Unauthorized: No token found');
    }

    try {
      // Verify token
      const payload = this.jwtService.verify(token);
      
      // Kiểm tra role
      if (!payload.role) {
        throw new UnauthorizedException('Unauthorized: No role found');
      }
      
      // Kiểm tra xem có phải là moderator, admin hoặc super admin không
      const isModerator = await this.adminService.isModerator(payload.sub);
      if (!isModerator) {
        throw new UnauthorizedException('Unauthorized: Not a moderator');
      }
      
      // Gán user vào request
      request.user = payload;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
  }
} 