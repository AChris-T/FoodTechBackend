import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';

@Injectable()
export class ElectionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateElectionDto) {
    return this.prisma.election.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
      include: { positions: { include: { candidates: true } } },
    });
  }

  findAll() {
    return this.prisma.election.findMany({
      include: { positions: { include: { candidates: true }, orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const election = await this.prisma.election.findUnique({
      where: { id },
      include: { positions: { include: { candidates: true }, orderBy: { createdAt: 'asc' } } },
    });
    if (!election) throw new NotFoundException('Election not found');
    return election;
  }

  async update(id: string, dto: UpdateElectionDto) {
    await this.findOne(id);
    return this.prisma.election.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.status && { status: dto.status }),
      },
      include: { positions: { include: { candidates: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.election.delete({ where: { id } });
  }
}
