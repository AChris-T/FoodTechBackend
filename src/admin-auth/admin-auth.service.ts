import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: AdminLoginDto): Promise<{ token: string; admin: { name: string; email: string } }> {
    const admin = await (this.prisma as any).admin.findUnique({
      where: { email: dto.email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });

    if (!admin || !(await bcrypt.compare(dto.password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign(
      { sub: admin.id, role: 'admin' },
      { expiresIn: '8h' },
    );

    return { token, admin: { name: admin.name, email: admin.email } };
  }

  async createAdmin(dto: CreateAdminDto) {
    const exists = await (this.prisma as any).admin.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return (this.prisma as any).admin.create({
      data: { name: dto.name, email: dto.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }
}
