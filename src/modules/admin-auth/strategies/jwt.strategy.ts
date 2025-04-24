import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Helper function to extract token from cookie
const cookieExtractor = (request: Request): string | null => {
  let token = null;
  if (request && request.cookies) {
    token = request.cookies['accessToken']; // Adjust cookie name if needed
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  // Declare logger without initializing here
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_ADMIN_SECRET');
    // Call super() first
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Try Authorization header first
        cookieExtractor, // Then try cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    // Initialize and use logger after super()
    this.logger = new Logger(JwtStrategy.name); 

    this.logger.debug(`Initializing Admin JwtStrategy with secret: ${secret ? 'Loaded' : 'UNDEFINED'}`);
    if (!secret) {
      this.logger.error('JWT_ADMIN_SECRET is not defined for Admin JwtStrategy!');
      // Throw error AFTER logging and super()
      throw new Error('JWT_ADMIN_SECRET is not defined in environment variables for Admin JwtStrategy');
    }
  }

  async validate(payload: any) {
    // Payload structure check (optional but recommended)
    if (!payload || !payload.sub || !payload.email || !payload.role) {
      // Use logger here as well (instance is available now)
      this.logger.warn('Invalid JWT payload structure received', payload);
      return null; 
    }
    // Return only necessary fields, excluding the Int id to avoid validation issues
    return { 
      email: payload.email,
      role: payload.role 
    };
  }
} 