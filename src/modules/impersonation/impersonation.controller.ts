import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ImpersonateDto } from './dto/impersonate.dto';

@Controller('impersonation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImpersonationController {
  constructor(private readonly impersonationService: ImpersonationService) {}

  @Post('impersonate')
  @Roles(Role.ADMIN)
  async impersonateUser(@Body() impersonateDto: ImpersonateDto, @Req() req) {
    const adminId = req.user.id;
    return this.impersonationService.impersonateUser(adminId, impersonateDto.userId);
  }

  @Post('validate')
  async validateToken(@Body('token') token: string) {
    return this.impersonationService.validateImpersonationToken(token);
  }

  @Post('end')
  async endImpersonation(@Body('token') token: string) {
    return this.impersonationService.endImpersonation(token);
  }
} 