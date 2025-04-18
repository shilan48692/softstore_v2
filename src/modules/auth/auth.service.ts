import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { username: registerDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
    });

    // Tạo token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: Role.USER,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: Role.USER,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Tìm user theo email hoặc username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: loginDto.email },
          { username: loginDto.email },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Tạo token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      // Kiểm tra token có trong blacklist không
      if (this.blacklistedTokens.has(token)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Thêm token cũ vào blacklist
      this.blacklistedTokens.add(token);

      // Tạo token mới
      const newToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      return {
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.user.create({
      data: {
        fullName: createAdminDto.fullName,
        username: createAdminDto.username,
        email: createAdminDto.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    const { password, ...result } = admin;
    return result;
  }
} 