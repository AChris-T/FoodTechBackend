import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCandidateDto) {
    return this.prisma.candidate.create({
      data: {
        positionId: dto.positionId,
        fullName: dto.fullName,
        bio: dto.bio,
        photoUrl: dto.photoUrl,
        level: dto.level,
      },
      include: {
        position: {
          include: { election: { select: { id: true, title: true } } },
        },
      },
    });
  }

  findAll() {
    return this.prisma.candidate.findMany({
      include: {
        position: {
          include: { election: { select: { id: true, title: true } } },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  findByPosition(positionId: string) {
    return this.prisma.candidate.findMany({
      where: { positionId },
      include: {
        position: {
          include: { election: { select: { id: true, title: true } } },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async remove(id: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    // Clear votes referencing this candidate first (no FK cascade defined on Vote.candidateId)
    await this.prisma.vote.deleteMany({ where: { candidateId: id } });
    return this.prisma.candidate.delete({ where: { id } });
  }
}
