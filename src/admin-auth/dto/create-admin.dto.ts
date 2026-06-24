import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'jane@votingplatform.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secure@9876', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
