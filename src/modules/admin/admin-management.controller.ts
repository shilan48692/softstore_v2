import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';

@Controller('admin/management')
export class AdminManagementController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAllAdmins() {
    return this.adminService.findAll({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get(':id')
  async getAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch(':id/role')
  async updateAdminRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminRoleDto: UpdateAdminRoleDto,
  ) {
    return this.adminService.update({
      where: { id },
      data: { role: updateAdminRoleDto.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
} 