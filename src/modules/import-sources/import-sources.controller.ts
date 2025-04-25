import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ImportSourcesService } from './import-sources.service';
import { CreateImportSourceDto } from './dto/create-import-source.dto';
import { UpdateImportSourceDto } from './dto/update-import-source.dto';
import { FindImportSourcesDto } from './dto/find-import-sources.dto';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard'; // Adjust path if needed

@UseGuards(JwtAuthGuard) // Apply auth guard to all routes in this controller
@Controller('admin/import-sources') // Base path for admin import sources
export class ImportSourcesController {
  constructor(private readonly importSourcesService: ImportSourcesService) {}

  @Post()
  create(@Body() createImportSourceDto: CreateImportSourceDto) {
    return this.importSourcesService.create(createImportSourceDto);
  }

  @Get('search')
  search(@Query() findImportSourcesDto: FindImportSourcesDto) {
    return this.importSourcesService.search(findImportSourcesDto);
  }

  @Get()
  findAll() {
    return this.importSourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importSourcesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportSourceDto: UpdateImportSourceDto) {
    return this.importSourcesService.update(id, updateImportSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importSourcesService.remove(id);
  }
} 