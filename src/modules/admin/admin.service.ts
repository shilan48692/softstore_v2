import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: AdminLoginDto) {
    const admin = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
        role: Role.ADMIN,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: Role.ADMIN,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: Role.ADMIN,
      },
    };
  }
} 