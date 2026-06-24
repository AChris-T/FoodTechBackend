import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a candidate for a position (Admin)' })
  @ApiCreatedResponse({ description: 'Candidate registered' })
  create(@Body() dto: CreateCandidateDto) {
    return this.candidatesService.create(dto);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all candidates with position/election info (Admin)' })
  @ApiOkResponse({ description: 'Array of all candidates' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Get('position/:positionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List candidates for a position (Voter)' })
  @ApiParam({ name: 'positionId', example: 'clx1pos456' })
  findByPosition(@Param('positionId') positionId: string) {
    return this.candidatesService.findByPosition(positionId);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a candidate (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1cand321' })
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}
