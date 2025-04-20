import { IsEmail, IsString, IsOptional } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
} 