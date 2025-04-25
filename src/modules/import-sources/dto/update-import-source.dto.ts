import { PartialType } from '@nestjs/mapped-types';
import { CreateImportSourceDto } from './create-import-source.dto';

export class UpdateImportSourceDto extends PartialType(CreateImportSourceDto) {} 