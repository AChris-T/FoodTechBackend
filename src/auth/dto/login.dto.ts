import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'UG/22/01234',
    description: 'Matric number or registered email address',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'P@ssword1', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
