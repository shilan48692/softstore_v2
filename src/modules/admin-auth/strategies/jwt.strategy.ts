import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_ADMIN_SECRET');
    console.log('>>> Admin JwtStrategy using secret from ConfigService:', secret ? secret.substring(0, 5) + '...' : 'UNDEFINED');
    if (!secret) {
      throw new Error('JWT_ADMIN_SECRET is not defined in environment variables for JwtStrategy');
    }
    super({
      jwtFromRequest: (request: Request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['accessToken'];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role 
    };
  }
} 