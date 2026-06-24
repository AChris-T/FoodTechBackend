import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { ElectionStatus } from '../../common/types/enums';
import { CreateElectionDto } from './create-election.dto';

export class UpdateElectionDto extends PartialType(CreateElectionDto) {
  @ApiPropertyOptional({ enum: ElectionStatus, example: ElectionStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ElectionStatus)
  status?: ElectionStatus;
}
