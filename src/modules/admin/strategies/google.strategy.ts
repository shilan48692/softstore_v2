import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../admin.service';

@Injectable()
export class GoogleAdminStrategy extends PassportStrategy(Strategy, 'google-admin') {
  constructor(
    private configService: ConfigService,
    private adminService: AdminService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_ADMIN_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    // Kiểm tra xem email có phải là admin không
    const isAdmin = await this.adminService.validateAdminEmail(user.email);
    if (!isAdmin) {
      return done(new Error('Unauthorized: Email is not registered as admin'), null);
    }

    return done(null, user);
  }
} 