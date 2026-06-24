import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{
    token: string;
    voter: { fullName: string; matricNumber: string; email: string };
  }> {
    // Accept either matric number or email as the identifier
    const voter = await (this.prisma as any).voter.findFirst({
      where: {
        OR: [
          { matricNumber: dto.identifier },
          { email: dto.identifier },
        ],
      },
      select: {
        id: true,
        fullName: true,
        matricNumber: true,
        email: true,
        password: true,
        canVote: true,
      },
    });

    if (!voter || !(await bcrypt.compare(dto.password, voter.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!voter.canVote) {
      throw new UnauthorizedException('Your voting access has been suspended. Please contact the admin.');
    }

    const token = this.jwt.sign({ sub: voter.id });

    return {
      token,
      voter: {
        fullName: voter.fullName,
        matricNumber: voter.matricNumber,
        email: voter.email,
      },
    };
  }

  async getProfile(voterId: string) {
    return (this.prisma as any).voter.findUnique({
      where: { id: voterId },
      select: {
        id: true,
        fullName: true,
        matricNumber: true,
        email: true,
        level: true,
        canVote: true,
        hasVoted: true,
      },
    });
  }
}
