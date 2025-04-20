import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRole } from '../admin.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      if (!payload.role || payload.role !== AdminRole.SUPER_ADMIN) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
} 