import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class DeleteBulkKeysDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true, message: 'Each ID in the array must be a valid UUID' })
  ids: string[];
} 