import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Đọc lại secret từ biến môi trường
    const secret = process.env.JWT_ADMIN_SECRET;
    console.log('>>> Admin JwtStrategy using secret from ENV:', secret ? secret.substring(0, 5) + '...' : 'UNDEFINED');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Sử dụng lại biến môi trường
    });
  }

  async validate(payload: any) {
    console.log('>>> Admin JwtStrategy validated payload:', payload);
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role 
    };
  }
} 