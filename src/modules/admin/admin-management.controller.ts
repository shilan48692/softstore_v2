import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRole } from '@prisma/client';

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
  async createAdmin(@Body() data: { email: string; name: string; password: string; role?: AdminRole }) {
    return this.adminService.createAdmin(data);
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
    @Body() data: { role: AdminRole },
  ) {
    return this.adminService.update({
      where: { id },
      data: { role: data.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
} 