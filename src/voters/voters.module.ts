import { Module } from '@nestjs/common';
import { VotersController } from './voters.controller';
import { VotersService } from './voters.service';

@Module({
  controllers: [VotersController],
  providers: [VotersService],
})
export class VotersModule {}
