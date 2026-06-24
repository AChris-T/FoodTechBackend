import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CastVoteDto } from './dto/cast-vote.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentVoter } from '../common/decorators/current-voter.decorator';

@ApiTags('votes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @ApiOperation({ summary: 'Cast a vote for a candidate (Voter)' })
  @ApiCreatedResponse({ description: 'Vote recorded' })
  castVote(@Body() dto: CastVoteDto, @CurrentVoter() voter: any) {
    return this.votesService.castVote(dto, voter.id);
  }

  @Post('finalize/:electionId')
  @ApiOperation({ summary: 'Mark ballot as submitted — sets hasVoted = true (Voter)' })
  @ApiParam({ name: 'electionId', example: 'clx1elec789' })
  finalizeVoting(@Param('electionId') electionId: string, @CurrentVoter() voter: any) {
    return this.votesService.finalizeVoting(electionId, voter.id);
  }

  @Get('my/:electionId')
  @ApiOperation({ summary: "Get the current voter's votes for an election (Voter)" })
  @ApiParam({ name: 'electionId', example: 'clx1elec789' })
  @ApiOkResponse({ description: 'Array of cast votes' })
  myVotes(@Param('electionId') electionId: string, @CurrentVoter() voter: any) {
    return this.votesService.myVotes(electionId, voter.id);
  }
}
