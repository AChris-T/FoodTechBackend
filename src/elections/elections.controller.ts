import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('elections')
@ApiBearerAuth()
@Controller('elections')
export class ElectionsController {
  constructor(private readonly electionsService: ElectionsService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create a new election (Admin)' })
  @ApiCreatedResponse({ description: 'Election created successfully' })
  create(@Body() dto: CreateElectionDto) {
    return this.electionsService.create(dto);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'List all elections (Admin)' })
  @ApiOkResponse({ description: 'Array of elections' })
  findAll() {
    return this.electionsService.findAll();
  }

  /** Voter-accessible: returns all elections so the voter page can find the active one */
  @Get('voter')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List elections accessible to a logged-in voter (Voter)' })
  @ApiOkResponse({ description: 'Array of elections with positions' })
  findAllForVoter() {
    return this.electionsService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get a single election by ID (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1elec789' })
  findOne(@Param('id') id: string) {
    return this.electionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update election details or status (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1elec789' })
  update(@Param('id') id: string, @Body() dto: UpdateElectionDto) {
    return this.electionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete an election (Admin)' })
  @ApiParam({ name: 'id', example: 'clx1elec789' })
  remove(@Param('id') id: string) {
    return this.electionsService.remove(id);
  }
}
