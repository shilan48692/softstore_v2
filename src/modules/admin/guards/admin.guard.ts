import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AdminService, AdminRole } from '../admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
      
      // Gán user vào request
      request.user = payload;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
  }
} 