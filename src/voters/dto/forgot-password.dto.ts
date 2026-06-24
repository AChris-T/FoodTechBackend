import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'UG/22/01234',
    description: 'Matric number or registered email address',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
