import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async getResults(electionId: string) {
    const positions = await this.prisma.position.findMany({
      where: { electionId },
      include: {
        candidates: {
          include: { votes: { select: { id: true } } },
          orderBy: { fullName: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Count unique voters who cast at least one vote for this election
    const positionIds = positions.map(p => p.id);
    const uniqueVoters = await this.prisma.vote.findMany({
      where: { positionId: { in: positionIds } },
      select: { voterId: true },
      distinct: ['voterId'],
    });

    return {
      voterCount: uniqueVoters.length,
      positions: positions.map(pos => ({
        positionId: pos.id,
        positionTitle: pos.title,
        candidates: pos.candidates
          .map(c => ({
            candidateId: c.id,
            fullName: c.fullName,
            photoUrl: c.photoUrl ?? null,
            level: c.level ?? null,
            voteCount: c.votes.length,
          }))
          .sort((a, b) => b.voteCount - a.voteCount),
      })),
    };
  }
}
