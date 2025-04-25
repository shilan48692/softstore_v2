import { Module } from '@nestjs/common';
import { ImportSourcesService } from './import-sources.service';
import { ImportSourcesController } from './import-sources.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImportSourcesController],
  providers: [ImportSourcesService],
})
export class ImportSourcesModule {} 