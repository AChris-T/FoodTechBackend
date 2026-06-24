import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Protects voter routes — reads voter_token cookie via 'jwt' strategy. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
