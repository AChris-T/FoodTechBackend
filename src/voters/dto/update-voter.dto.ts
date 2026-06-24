import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class UpdateVoterDto {
  @ApiPropertyOptional({ example: 'John Adewale Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '400L' })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({ example: 'john.doe@stu.ui.edu.ng' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({ example: true, description: 'Toggle voter eligibility' })
  @IsBoolean()
  @IsOptional()
  canVote?: boolean;
}
