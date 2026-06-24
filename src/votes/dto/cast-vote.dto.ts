import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CastVoteDto {
  @ApiProperty({ example: 'clx1elec789' })
  @IsString()
  @IsNotEmpty()
  electionId: string;

  @ApiProperty({ example: 'clx1pos456' })
  @IsString()
  @IsNotEmpty()
  positionId: string;

  @ApiProperty({ example: 'clx1cand321' })
  @IsString()
  @IsNotEmpty()
  candidateId: string;
}
