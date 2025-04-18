import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
} 