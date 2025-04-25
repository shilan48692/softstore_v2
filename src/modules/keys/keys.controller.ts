import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards, UsePipes, ValidationPipe, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import { DeleteBulkKeysDto } from './dto/delete-bulk-keys.dto';
import { CreateBulkKeysDto } from './dto/create-bulk-keys.dto';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';

@Controller('admin/keys')
export class KeysController {
  private readonly logger = new Logger(KeysController.name);

  constructor(private readonly keysService: KeysService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query() findKeysDto: FindKeysDto) {
    return this.keysService.search(findKeysDto);
  }

  @Get('by-activation-code/:activationCode')
  @UseGuards(JwtAuthGuard)
  findByActivationCode(@Param('activationCode') activationCode: string) {
    return this.keysService.findByActivationCode(activationCode);
  }

  @Get('by-product/:productId')
  @UseGuards(JwtAuthGuard)
  findByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.keysService.findByProductId(productId);
  }

  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.keysService.findByUserId(userId);
  }

  @Get('by-email/:userEmail')
  @UseGuards(JwtAuthGuard)
  findByUserEmail(@Param('userEmail') userEmail: string) {
    return this.keysService.findByUserEmail(userEmail);
  }

  @Get('by-order/:orderId')
  @UseGuards(JwtAuthGuard)
  findByOrderId(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.keysService.findByOrderId(orderId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.keysService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.keysService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createKeyDto: CreateKeyDto) {
    return this.keysService.create(createKeyDto);
  }

  @Post('bulk-create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async createBulk(@Body() createBulkKeysDto: CreateBulkKeysDto) {
    this.logger.debug(`Received request for POST /admin/keys/bulk-create with body: ${JSON.stringify(createBulkKeysDto)}`);
    const result = await this.keysService.createBulk(createBulkKeysDto);
    this.logger.log(`Bulk create result count: ${result.count}`);
    return { createdCount: result.count };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ) {
    return this.keysService.update(id, updateKeyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.keysService.remove(id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteBulk(@Body() deleteBulkKeysDto: DeleteBulkKeysDto) {
    this.logger.debug(`Received request for POST /admin/keys/bulk with body: ${JSON.stringify(deleteBulkKeysDto)}`);
    
    const ids = deleteBulkKeysDto?.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      this.logger.warn(`Manual Validation Failed: 'ids' is not a non-empty array.`);
      throw new BadRequestException(`Request body must contain a non-empty 'ids' array.`);
    }
    const invalidId = ids.find(id => !isUUID(id, '4'));
    if (invalidId) {
        this.logger.warn(`Manual Validation Failed: Invalid UUID format found in ids array: ${invalidId}`);
        throw new BadRequestException(`Invalid UUID format found in ids array: ${invalidId}`);
    }

    const result = await this.keysService.deleteBulk(ids);
    this.logger.log(`Bulk delete result count: ${result.count}`);
    return { deletedCount: result.count };
  }
}