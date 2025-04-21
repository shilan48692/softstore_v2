import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-client') {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_CLIENT_SECRET');
    if (!secret) {
      Logger.error('FATAL: JWT_CLIENT_SECRET is not defined for Client JwtStrategy!', JwtStrategy.name);
      throw new Error('JWT_CLIENT_SECRET is not defined in environment variables for Client JwtStrategy');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    
    this.logger = new Logger(JwtStrategy.name);
    this.logger.debug('Client JwtStrategy initialized successfully');
  }

  async validate(payload: any) {
    if (!payload || !payload.sub || !payload.email) {
      this.logger.warn('Invalid JWT payload structure received for client', payload);
      return null;
    }
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role || 'user'
    };
  }
} 