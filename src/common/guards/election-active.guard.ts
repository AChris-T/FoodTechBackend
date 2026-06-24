import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ElectionStatus } from '../types/enums';

@Injectable()
export class ElectionActiveGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const electionId: string =
      request.params.electionId ?? request.body.electionId;

    if (!electionId) throw new BadRequestException('electionId is required');

    const election = await (this.prisma as any).election.findUnique({
      where: { id: electionId },
      select: { status: true },
    });

    if (!election) throw new NotFoundException('Election not found');

    if (election.status !== ElectionStatus.ACTIVE) {
      throw new BadRequestException('Election is not currently active');
    }

    return true;
  }
}
