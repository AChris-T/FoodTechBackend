import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateVoterDto } from './create-voter.dto';

export class BulkImportDto {
  @ApiProperty({ type: [CreateVoterDto], description: 'Array of voters to import' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateVoterDto)
  voters: CreateVoterDto[];
}
