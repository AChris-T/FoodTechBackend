import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { ElectionsModule } from './elections/elections.module';
import { PositionsModule } from './positions/positions.module';
import { CandidatesModule } from './candidates/candidates.module';
import { VotersModule } from './voters/voters.module';
import { VotesModule } from './votes/votes.module';
import { ResultsModule } from './results/results.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    PrismaModule,
    MailModule,
    QueueModule,
    AuthModule,
    AdminAuthModule,
    ElectionsModule,
    PositionsModule,
    CandidatesModule,
    VotersModule,
    VotesModule,
    ResultsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
