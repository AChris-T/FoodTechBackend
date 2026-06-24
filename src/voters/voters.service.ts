import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { BulkImportDto } from './dto/bulk-import.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

function generatePassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

function parseCSV(buffer: Buffer): Array<Record<string, string>> {
  const text = buffer.toString('utf-8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

const VOTER_SELECT = {
  id: true,
  matricNumber: true,
  fullName: true,
  level: true,
  email: true,
  photoUrl: true,
  canVote: true,
  hasVoted: true,
  createdAt: true,
};

@Injectable()
export class VotersService {
  private readonly logger = new Logger(VotersService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(dto: CreateVoterDto) {
    const exists = await (this.prisma as any).voter.findFirst({
      where: { OR: [{ matricNumber: dto.matricNumber }, { email: dto.email }] },
    });
    if (exists) throw new ConflictException('Matric number or email already registered');

    const plainPassword = generatePassword();
    const hashed = await bcrypt.hash(plainPassword, 12);

    const voter = await (this.prisma as any).voter.create({
      data: {
        matricNumber: dto.matricNumber,
        fullName: dto.fullName,
        level: dto.level,
        email: dto.email,
        password: hashed,
      },
      select: VOTER_SELECT,
    });

    // Send credentials email directly — error is logged but does not roll back voter creation
    try {
      const activeElection = await (this.prisma as any).election.findFirst({
        where: { status: 'ACTIVE' },
        select: { title: true, startDate: true, endDate: true },
      });
      await this.mail.sendVoterCredentials({
        fullName: dto.fullName,
        matricNumber: dto.matricNumber,
        level: dto.level,
        email: dto.email,
        password: plainPassword,
        loginUrl: `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/login`,
        electionTitle: activeElection?.title,
        electionStartDate: activeElection?.startDate?.toISOString(),
        electionEndDate: activeElection?.endDate?.toISOString(),
      });
      this.logger.log(`Credentials email sent to ${dto.email}`);
    } catch (err) {
      this.logger.error(`Failed to send credentials email to ${dto.email}`, err);
    }

    return voter;
  }

  async bulkImport(dto: BulkImportDto) {
    const results = await Promise.allSettled(dto.voters.map((v) => this.create(v)));
    return {
      created: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
      total: dto.voters.length,
    };
  }

  async bulkImportCSV(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No CSV file provided');

    const rows = parseCSV(file.buffer);
    if (!rows.length) throw new BadRequestException('CSV is empty or has no data rows');

    const required = ['matricNumber', 'fullName', 'level', 'email'];
    const missing = required.filter((k) => !(k in (rows[0] ?? {})));
    if (missing.length) {
      throw new BadRequestException(`CSV missing columns: ${missing.join(', ')}`);
    }

    const dtos: CreateVoterDto[] = rows.map((r) => ({
      matricNumber: r.matricNumber,
      fullName: r.fullName,
      level: r.level,
      email: r.email,
    }));

    const results = await Promise.allSettled(dtos.map((v) => this.create(v)));

    const errors = results
      .map((r, i) =>
        r.status === 'rejected'
          ? `Row ${i + 2}: ${(r as PromiseRejectedResult).reason?.message}`
          : null,
      )
      .filter(Boolean);

    return {
      created: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
      total: dtos.length,
      errors,
    };
  }

  async findAll() {
    return (this.prisma as any).voter.findMany({
      select: VOTER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const voter = await (this.prisma as any).voter.findUnique({
      where: { id },
      select: VOTER_SELECT,
    });
    if (!voter) throw new NotFoundException('Voter not found');
    return voter;
  }

  async update(id: string, dto: UpdateVoterDto) {
    await this.findOne(id);

    if (dto.email) {
      const conflict = await (this.prisma as any).voter.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Email already in use by another voter');
    }

    return (this.prisma as any).voter.update({
      where: { id },
      data: dto,
      select: VOTER_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Clear votes first to satisfy FK constraint (Vote.voterId has no cascade delete)
    await this.prisma.vote.deleteMany({ where: { voterId: id } });
    await (this.prisma as any).voter.delete({ where: { id } });
    return { success: true, message: 'Voter deleted successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const voter = await (this.prisma as any).voter.findFirst({
      where: {
        OR: [{ matricNumber: dto.identifier }, { email: dto.identifier }],
      },
      select: {
        id: true,
        fullName: true,
        level: true,
        matricNumber: true,
        email: true,
      },
    });

    if (voter) {
      const plainPassword = generatePassword();
      const hashed = await bcrypt.hash(plainPassword, 12);

      await (this.prisma as any).voter.update({
        where: { id: voter.id },
        data: { password: hashed },
      });

      try {
        const activeElection = await (this.prisma as any).election.findFirst({
          where: { status: 'ACTIVE' },
          select: { title: true, startDate: true, endDate: true },
        });
        await this.mail.sendVoterCredentials({
          fullName: voter.fullName,
          matricNumber: voter.matricNumber,
          level: voter.level,
          email: voter.email,
          password: plainPassword,
          loginUrl: `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/login`,
          electionTitle: activeElection?.title,
          electionStartDate: activeElection?.startDate?.toISOString(),
          electionEndDate: activeElection?.endDate?.toISOString(),
        });
      } catch (err) {
        this.logger.error(`Failed to send password reset email to ${voter.email}`, err);
      }
    }

    return {
      success: true,
      message: 'If the account exists, a new password has been sent.',
    };
  }
}
