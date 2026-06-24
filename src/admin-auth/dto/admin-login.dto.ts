import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@votingplatform.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin@1234', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
