import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ResultsService } from './results.service';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get(':electionId')
  @ApiOperation({ summary: 'Get live vote tallies for an election (public)' })
  @ApiParam({ name: 'electionId', example: 'clx1elec789' })
  @ApiOkResponse({ description: 'Vote counts grouped by position and candidate' })
  getResults(@Param('electionId') electionId: string) {
    return this.resultsService.getResults(electionId);
  }
}
