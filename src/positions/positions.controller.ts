import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@ApiTags('positions')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a position to an election (Admin)' })
  @ApiCreatedResponse({ description: 'Position created' })
  create(@Body() dto: CreatePositionDto) {
    return this.positionsService.create(dto);
  }

  @Get('election/:electionId')
  @ApiOperation({ summary: 'List all positions for an election' })
  @ApiParam({ name: 'electionId', example: 'clx1elec789' })
  @ApiOkResponse({ description: 'Array of positions' })
  findByElection(@Param('electionId') electionId: string) {
    return this.positionsService.findByElection(electionId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a position (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1pos456' })
  remove(@Param('id') id: string) {
    return this.positionsService.remove(id);
  }
}
