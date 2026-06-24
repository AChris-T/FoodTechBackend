import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePositionDto) {
    return this.prisma.position.create({
      data: {
        electionId: dto.electionId,
        title: dto.title,
        maxVotes: dto.maxVotes ?? 1,
      },
      include: { candidates: true },
    });
  }

  findByElection(electionId: string) {
    return this.prisma.position.findMany({
      where: { electionId },
      include: {
        candidates: {
          orderBy: { fullName: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async remove(id: string) {
    const pos = await this.prisma.position.findUnique({ where: { id } });
    if (!pos) throw new NotFoundException('Position not found');
    return this.prisma.position.delete({ where: { id } });
  }
}
