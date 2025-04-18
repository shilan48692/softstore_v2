import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { FindKeysDto } from './dto/find-keys.dto';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  create(@Body() createKeyDto: CreateKeyDto) {
    return this.keysService.create(createKeyDto);
  }

  @Get()
  findAll() {
    return this.keysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.keysService.findOne(id);
  }

  @Get('by-activation-code/:activationCode')
  findByActivationCode(@Param('activationCode') activationCode: string) {
    return this.keysService.findByActivationCode(activationCode);
  }

  @Get('by-product/:productId')
  findByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.keysService.findByProductId(productId);
  }

  @Get('by-user/:userId')
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.keysService.findByUserId(userId);
  }

  @Get('by-email/:userEmail')
  findByUserEmail(@Param('userEmail') userEmail: string) {
    return this.keysService.findByUserEmail(userEmail);
  }

  @Get('by-order/:orderId')
  findByOrderId(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.keysService.findByOrderId(orderId);
  }

  @Get('search')
  search(@Query() findKeysDto: FindKeysDto) {
    return this.keysService.search(findKeysDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ) {
    return this.keysService.update(id, updateKeyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.keysService.remove(id);
  }
} 