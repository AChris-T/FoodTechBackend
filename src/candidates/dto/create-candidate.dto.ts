import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ example: 'clx1pos456', description: 'ID of the position to contest' })
  @IsString()
  @IsNotEmpty()
  positionId: string;

  @ApiProperty({ example: 'John Adewale Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: '400-level Food Technology student with 3 years of leadership experience.' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiPropertyOptional({ example: '300L', description: 'Academic level e.g. 100L, 200L, 300L, 400L, 500L, PG' })
  @IsString()
  @IsOptional()
  level?: string;
}
