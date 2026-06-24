import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreateElectionDto {
  @ApiProperty({ example: 'SUG General Election 2026' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: 'Annual student union government election.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-07-01T08:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-07-01T18:00:00.000Z' })
  @IsDateString()
  endDate: string;
}
