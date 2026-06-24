import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminJwtPayload {
  sub: string;
  role: 'admin';
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret')!,
    });
  }

  async validate(payload: AdminJwtPayload) {
    const admin = await (this.prisma as any).admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true },
    });

    if (!admin) throw new UnauthorizedException();
    return { ...admin, role: 'admin' as const };
  }
}
