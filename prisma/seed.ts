import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const name = process.env.DEFAULT_ADMIN_NAME ?? 'Super Admin';
  const email = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@votingplatform.com';
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'Admin@1234';

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash },
  });

  console.log(`Seeded admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
