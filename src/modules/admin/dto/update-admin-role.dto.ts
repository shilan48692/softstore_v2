import { IsEnum, IsNotEmpty } from 'class-validator';
import { AdminRole } from '@prisma/client';

export class UpdateAdminRoleDto {
  @IsEnum(AdminRole, { message: 'Invalid admin role' })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  role: AdminRole;
} 