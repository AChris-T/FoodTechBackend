import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Protects admin routes — reads admin_token cookie via 'admin-jwt' strategy. */
@Injectable()
export class AdminAuthGuard extends AuthGuard('admin-jwt') {}
