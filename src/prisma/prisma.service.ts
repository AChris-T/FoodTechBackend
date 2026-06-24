import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const rawUrl = process.env.DATABASE_URL ?? '';
    const url = new URL(rawUrl);
    const sslmode = url.searchParams.get('sslmode');
    url.searchParams.delete('sslmode');

    const ssl =
      !sslmode || sslmode === 'disable'
        ? false
        : { rejectUnauthorized: sslmode === 'verify-full' };

    const pool = new Pool({ connectionString: url.toString(), ssl });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
