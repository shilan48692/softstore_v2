import { IsString, IsNotEmpty } from 'class-validator';

export class ImpersonateDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
} 