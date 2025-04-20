import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Lấy toàn bộ token
    const token = request.headers.authorization?.startsWith('Bearer ') 
                  ? request.headers.authorization.substring(7) 
                  : undefined;
    console.log(`>>> JwtAuthGuard processing request for: ${request.url}`);
    // Log toàn bộ token nhận được
    console.log(`>>> Full Token from header: ${token || 'NONE'}`); 
    
    // Gọi super.canActivate() để kích hoạt strategy
    // Nếu strategy validate thành công, nó sẽ trả về true
    // Nếu strategy validate thất bại (sai secret, hết hạn), nó sẽ throw error
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Hàm này được gọi SAU KHI strategy validate xong (hoặc thất bại)
    console.log(`>>> JwtAuthGuard handleRequest: err=${err}, user=${JSON.stringify(user)}, info=${info}`);
    
    if (err || !user) {
      // Log lỗi cụ thể nếu có
      console.error(`>>> JwtAuthGuard Unauthorized: ${err || info?.message || 'No user found'}`);
      throw err || new UnauthorizedException('Không có quyền truy cập');
    }
    // Trả về user nếu xác thực thành công
    console.log(`>>> JwtAuthGuard Authorized user: ${JSON.stringify(user)}`);
    return user;
  }
} 