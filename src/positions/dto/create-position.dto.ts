import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePositionDto {
  @ApiProperty({ example: 'clx1abc123', description: 'ID of the parent election' })
  @IsString()
  @IsNotEmpty()
  electionId: string;

  @ApiProperty({ example: 'President' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 1, description: 'Max votes a voter can cast for this position' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxVotes?: number;
}
