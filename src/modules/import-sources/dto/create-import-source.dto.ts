import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateImportSourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Contact link must be a valid URL' })
  contactLink?: string;
} 