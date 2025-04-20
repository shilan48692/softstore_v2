import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ClientLoginDto } from './dto/client-login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class ClientAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateRandomPassword(): string {
    return randomBytes(8).toString('hex');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: ClientLoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      role: 'CLIENT'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        picture: user.picture
      }
    };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    let user = await this.usersService.findByEmail(googleLoginDto.email);
    
    if (!user) {
      // Tạo mật khẩu ngẫu nhiên cho user mới
      const randomPassword = this.generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      // Tạo user mới với thông tin từ Google
      user = await this.usersService.create({
        email: googleLoginDto.email,
        name: googleLoginDto.name,
        password: hashedPassword,
        picture: googleLoginDto.picture,
        googleId: googleLoginDto.googleId
      });

      // TODO: Gửi email chứa mật khẩu ngẫu nhiên cho user
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      role: 'CLIENT'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        picture: user.picture
      }
    };
  }
} 