import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateVoterDto {
  @ApiProperty({ example: 'UG/22/01234' })
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @ApiProperty({ example: 'John Adewale Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '300L', description: 'Student level e.g. 100L, 200L, 300L' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ example: 'john.doe@stu.ui.edu.ng' })
  @IsEmail()
  email: string;
}
