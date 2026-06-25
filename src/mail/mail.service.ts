import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  voterCredentialsTemplate,
  CredentialsTemplateData,
} from './templates/voter-credentials.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;
  private from: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(config.get<string>('mail.resendApiKey'));
    this.from = config.get<string>('mail.from') ?? 'FoodTech Voting <onboarding@resend.dev>';
  }

  async sendVoterCredentials(data: CredentialsTemplateData): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to: data.email,
      subject: 'Your Voting Account Credentials',
      html: voterCredentialsTemplate(data),
    });
    this.logger.log(`Credentials email sent → ${data.email}`);
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const from = this.from;
    const year = new Date().getFullYear();
    await this.resend.emails.send({
      from,
      to,
      subject: 'Reset Your Voting Password',
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Reset Your Password</title></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0F4F0;padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" border="0"
           style="max-width:520px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Top accent -->
      <tr><td style="background:#C9A84C;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

      <!-- Header -->
      <tr>
        <td style="background:#0A2E1A;padding:36px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:44px;height:44px;background:#C9A84C;border-radius:50%;text-align:center;vertical-align:middle;font-size:16px;font-weight:900;color:#0A2E1A;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">FV</td>
                  <td style="padding-left:10px;text-align:left;vertical-align:middle;">
                    <p style="margin:0;color:#fff;font-size:15px;font-weight:800;">FoodTech Voting</p>
                    <p style="margin:2px 0 0;color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">University of Ibadan</p>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td align="center">
                <!-- Lock icon: circle with inner square -->
                <table cellpadding="0" cellspacing="0" style="display:inline-table;margin-bottom:16px;">
                  <tr><td style="width:56px;height:56px;background:rgba(201,168,76,0.15);border:2px solid rgba(201,168,76,0.35);border-radius:50%;text-align:center;vertical-align:middle;font-size:24px;font-weight:900;color:#C9A84C;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                    &#128274;
                  </td></tr>
                </table>
                <h1 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.3px;">Password Reset Request</h1>
                <p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px;letter-spacing:0.3px;">This link expires in 1 hour</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:36px 40px 32px;">
          <p style="margin:0 0 6px;color:#111827;font-size:17px;font-weight:700;">Reset your password</p>
          <p style="margin:0 0 28px;color:#4B5563;font-size:14px;line-height:1.8;">
            We received a request to reset the password for your FoodTech Voting account.
            Click the button below to set a new password. If you did not make this request, you can safely ignore this email.
          </p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td align="center">
                <a href="${resetUrl}"
                   style="display:inline-block;background:#0A2E1A;color:#C9A84C;text-decoration:none;font-size:15px;font-weight:700;padding:16px 48px;border-radius:50px;letter-spacing:0.4px;border:2px solid #C9A84C;">
                  Reset Password &nbsp;&rarr;
                </a>
              </td>
            </tr>
          </table>

          <!-- Fallback URL -->
          <p style="margin:0 0 6px;color:#9CA3AF;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Or copy this link</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 16px;">
                <p style="margin:0;font-size:11px;color:#6B7280;word-break:break-all;font-family:'Courier New',Courier,monospace;">${resetUrl}</p>
              </td>
            </tr>
          </table>

          <!-- Security notice -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-left:4px solid #0A2E1A;border-radius:8px;padding:14px 18px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td valign="top" style="padding-right:10px;padding-top:1px;">
                    <div style="width:18px;height:18px;background:#0A2E1A;border-radius:4px;text-align:center;line-height:18px;font-size:11px;font-weight:900;color:#C9A84C;">i</div>
                  </td>
                  <td>
                    <p style="margin:0;color:#374151;font-size:12px;line-height:1.75;font-weight:600;">Didn&rsquo;t request this?</p>
                    <p style="margin:4px 0 0;color:#6B7280;font-size:12px;line-height:1.75;">
                      If you didn&rsquo;t request a password reset, no action is needed. Your account remains secure.
                      Contact the election committee if you have concerns.
                    </p>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #F3F4F6;margin:0;" /></td></tr>

      <!-- Footer -->
      <tr>
        <td style="padding:22px 40px 26px;text-align:center;">
          <p style="margin:0 0 6px;color:#6B7280;font-size:12px;line-height:1.7;">
            Automated message from the FoodTech Student Voting Platform.<br/>Please do not reply to this email.
          </p>
          <p style="margin:0;color:#D1D5DB;font-size:11px;">&copy; ${year} FoodTech Voting Platform &nbsp;&bull;&nbsp; University of Ibadan</p>
        </td>
      </tr>

      <!-- Bottom accent -->
      <tr><td style="background:#0A2E1A;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
    });
    this.logger.log(`Password reset email sent → ${to}`);
  }
}
