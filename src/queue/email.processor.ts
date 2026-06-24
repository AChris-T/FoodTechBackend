import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

export const EMAIL_QUEUE = 'email';

export type EmailJob =
  | { type: 'voter-credentials'; payload: Parameters<MailService['sendVoterCredentials']>[0] }
  | { type: 'password-reset'; payload: { to: string; resetUrl: string } };

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private mail: MailService) {
    super();
  }

  async process(job: Job<EmailJob>): Promise<void> {
    this.logger.log(`Processing job ${job.id} — type: ${job.data.type}`);

    try {
      if (job.data.type === 'voter-credentials') {
        await this.mail.sendVoterCredentials(job.data.payload);
      } else if (job.data.type === 'password-reset') {
        await this.mail.sendPasswordReset(
          job.data.payload.to,
          job.data.payload.resetUrl,
        );
      } else {
        throw new UnrecoverableError(`Unknown job type`);
      }
    } catch (err) {
      this.logger.error(`Job ${job.id} failed`, err);
      throw err;
    }
  }
}
