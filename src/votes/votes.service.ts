import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CastVoteDto } from './dto/cast-vote.dto';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async castVote(dto: CastVoteDto, voterId: string) {
    // 1. Election must be ACTIVE
    const election = await this.prisma.election.findUnique({
      where: { id: dto.electionId },
      include: { positions: { select: { id: true } } },
    });
    if (!election || election.status !== 'ACTIVE') {
      throw new ForbiddenException('Election is not currently active');
    }

    // 2. Voter must be eligible
    const voter = await this.prisma.voter.findUnique({ where: { id: voterId } });
    if (!voter || !voter.canVote) {
      throw new ForbiddenException('You are not eligible to vote');
    }

    // 3. Position must belong to this election
    const position = await this.prisma.position.findFirst({
      where: { id: dto.positionId, electionId: dto.electionId },
    });
    if (!position) throw new NotFoundException('Position not found in this election');

    // 4. Candidate must belong to this position
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, positionId: dto.positionId },
    });
    if (!candidate) throw new NotFoundException('Candidate not found for this position');

    // 5. Record vote (unique[voterId, positionId] prevents double voting per position)
    let vote: Awaited<ReturnType<typeof this.prisma.vote.create>>;
    try {
      vote = await this.prisma.vote.create({
        data: { voterId, positionId: dto.positionId, candidateId: dto.candidateId },
        select: { id: true, positionId: true, candidateId: true, castedAt: true },
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new ConflictException('You have already voted for this position');
      }
      throw err;
    }

    // 6. Mark voter as hasVoted on first successful vote cast
    if (!voter.hasVoted) {
      await this.prisma.voter.update({
        where: { id: voterId },
        data: { hasVoted: true },
      });
    }

    return vote;
  }

  async finalizeVoting(electionId: string, voterId: string) {
    // Require at least one vote in this election before marking as voted
    const positions = await this.prisma.position.findMany({
      where: { electionId },
      select: { id: true },
    });
    const voteCount = await this.prisma.vote.count({
      where: { voterId, positionId: { in: positions.map(p => p.id) } },
    });
    if (voteCount === 0) {
      throw new ForbiddenException('No votes have been cast for this election');
    }

    await this.prisma.voter.update({
      where: { id: voterId },
      data: { hasVoted: true },
    });

    return { finalized: true };
  }

  async myVotes(electionId: string, voterId: string) {
    const positions = await this.prisma.position.findMany({
      where: { electionId },
      select: { id: true },
    });
    const positionIds = positions.map(p => p.id);
    return this.prisma.vote.findMany({
      where: { voterId, positionId: { in: positionIds } },
      select: { positionId: true, candidateId: true, castedAt: true },
    });
  }
}
