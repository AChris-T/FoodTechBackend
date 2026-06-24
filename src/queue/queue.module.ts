import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { EmailProcessor, EMAIL_QUEUE } from './email.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('redis.url');

        const sharedOptions = {
          // Stop hammering DNS when the host is unreachable
          maxRetriesPerRequest: null,
          enableOfflineQueue: false,
          retryStrategy: (times: number) => {
            if (times > 3) return null; // give up after 3 attempts
            return Math.min(times * 500, 3000);
          },
        };

        if (redisUrl) {
          return { connection: { url: redisUrl, ...sharedOptions } };
        }

        return {
          connection: {
            host: config.get<string>('redis.host'),
            port: config.get<number>('redis.port'),
            ...sharedOptions,
          },
        };
      },
    }),
    BullModule.registerQueue({ name: EMAIL_QUEUE }),
  ],
  providers: [EmailProcessor],
  exports: [BullModule],
})
export class QueueModule {}
