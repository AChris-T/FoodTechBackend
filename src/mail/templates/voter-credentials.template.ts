export interface CredentialsTemplateData {
  fullName: string;
  matricNumber: string;
  level: string;
  email: string;
  password: string;
  loginUrl: string;
  electionTitle?: string;
  electionStartDate?: string;
  electionEndDate?: string;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function voterCredentialsTemplate(data: CredentialsTemplateData): string {
  const year = new Date().getFullYear();
  const hasElection = !!(data.electionTitle && data.electionStartDate && data.electionEndDate);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Your Voting Credentials</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F4F0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0F4F0;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- ── Top accent bar ─────────────────────────────────── -->
        <tr>
          <td style="background:#C9A84C;height:4px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- ── Header ─────────────────────────────────────────── -->
        <tr>
          <td style="background:#0A2E1A;padding:40px 40px 36px;text-align:center;">

            <!-- Brand wordmark -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:28px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <!-- Logo mark: two nested circles -->
                      <td style="width:52px;height:52px;background:#C9A84C;border-radius:50%;text-align:center;vertical-align:middle;font-size:20px;font-weight:900;color:#0A2E1A;letter-spacing:-1px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        FV
                      </td>
                      <td style="padding-left:12px;text-align:left;vertical-align:middle;">
                        <p style="margin:0;color:#ffffff;font-size:17px;font-weight:800;letter-spacing:0.2px;line-height:1;">FoodTech Voting</p>
                        <p style="margin:3px 0 0;color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.8px;text-transform:uppercase;">University of Ibadan</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:6px;">
                  <!-- Large checkmark badge -->
                  <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                    <tr>
                      <td style="width:64px;height:64px;background:rgba(201,168,76,0.15);border:2px solid rgba(201,168,76,0.4);border-radius:50%;text-align:center;vertical-align:middle;">
                        <!-- CSS checkmark using unicode, styled large -->
                        <span style="font-size:28px;font-weight:700;color:#C9A84C;line-height:1;">&#10003;</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:16px;">
                  <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.3px;line-height:1.2;">
                    You&rsquo;re Eligible to Vote
                  </h1>
                  <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:0.4px;">
                    Your voting account has been created
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Eligibility ribbon ──────────────────────────────── -->
        <tr>
          <td style="background:#E8F5EE;border-bottom:2px solid #1B6B3A;padding:14px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <!-- Small filled circle icon -->
                <td width="32" valign="middle">
                  <div style="width:24px;height:24px;background:#1B6B3A;border-radius:50%;text-align:center;line-height:24px;font-size:13px;font-weight:800;color:#fff;">
                    &#10003;
                  </div>
                </td>
                <td valign="middle" style="padding-left:8px;">
                  <p style="margin:0;color:#0A2E1A;font-size:13px;font-weight:700;">Voting eligibility confirmed</p>
                  <p style="margin:3px 0 0;color:#1B6B3A;font-size:12px;">You are registered and authorized to participate in the upcoming election.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Body ───────────────────────────────────────────── -->
        <tr>
          <td style="padding:36px 40px 32px;">

            <!-- Greeting -->
            <p style="margin:0 0 4px;color:#111827;font-size:19px;font-weight:700;">Hello, ${data.fullName}</p>
            <p style="margin:0 0 28px;color:#4B5563;font-size:14px;line-height:1.8;">
              Your account on the <strong style="color:#0A2E1A;">FoodTech Student Voting Platform</strong> is ready.
              An important election is coming up &mdash; use the credentials below to log in and cast your vote.
            </p>

            <!-- Section label -->
            <p style="margin:0 0 12px;color:#9CA3AF;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">
              Your Login Credentials
            </p>

            <!-- Matric Number card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="background:#F8FFFE;border:1.5px solid #BBF7D0;border-radius:10px;padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 6px;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Matric Number &nbsp;/&nbsp; Username</p>
                        <p style="margin:0;font-size:22px;font-weight:800;color:#0A2E1A;letter-spacing:2px;font-family:'Courier New',Courier,monospace;">${data.matricNumber}</p>
                      </td>
                      <!-- Key icon: small colored square -->
                      <td width="36" valign="middle" align="right">
                        <div style="width:32px;height:32px;background:#E8F5EE;border-radius:8px;text-align:center;line-height:32px;font-size:15px;color:#1B6B3A;font-weight:700;">
                          #
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Password card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="background:#FFFBF0;border:1.5px solid #FDE68A;border-radius:10px;padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 6px;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Password</p>
                        <p style="margin:0 0 10px;font-size:22px;font-weight:800;color:#92400E;letter-spacing:3px;font-family:'Courier New',Courier,monospace;">${data.password}</p>
                        <!-- Inline warning bar -->
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:16px;height:16px;background:#D97706;border-radius:50%;text-align:center;line-height:16px;font-size:10px;font-weight:900;color:#fff;vertical-align:middle;">!</td>
                            <td style="padding-left:7px;vertical-align:middle;">
                              <p style="margin:0;font-size:11px;color:#92400E;font-weight:600;">Keep this private. You may be asked to change it on first login.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td width="36" valign="top" align="right" style="padding-top:2px;">
                        <div style="width:32px;height:32px;background:#FEF3C7;border-radius:8px;text-align:center;line-height:32px;font-size:16px;color:#D97706;font-weight:700;">
                          *
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Level card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#F9F7FF;border:1.5px solid #DDD6FE;border-radius:10px;padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 6px;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Academic Level</p>
                        <p style="margin:0;font-size:20px;font-weight:800;color:#5B21B6;">${data.level}</p>
                      </td>
                      <td width="36" valign="middle" align="right">
                        <div style="width:32px;height:32px;background:#EDE9FE;border-radius:8px;text-align:center;line-height:32px;font-size:14px;color:#6D28D9;font-weight:800;">
                          L
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            ${hasElection ? `
            <!-- Election date/time card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#0A2E1A;border-radius:10px;padding:18px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0;font-size:10px;color:rgba(201,168,76,0.8);text-transform:uppercase;letter-spacing:0.12em;font-weight:700;">Upcoming Election</p>
                        <p style="margin:6px 0 0;font-size:16px;font-weight:800;color:#ffffff;line-height:1.3;">${data.electionTitle}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="48%" style="background:rgba(255,255,255,0.07);border-radius:8px;padding:12px 14px;">
                              <p style="margin:0 0 4px;font-size:9px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Starts</p>
                              <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;">${fmtDate(data.electionStartDate!)}</p>
                              <p style="margin:3px 0 0;font-size:12px;color:#C9A84C;font-weight:600;">${fmtTime(data.electionStartDate!)}</p>
                            </td>
                            <td width="4%"></td>
                            <td width="48%" style="background:rgba(255,255,255,0.07);border-radius:8px;padding:12px 14px;">
                              <p style="margin:0 0 4px;font-size:9px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Ends</p>
                              <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;">${fmtDate(data.electionEndDate!)}</p>
                              <p style="margin:3px 0 0;font-size:12px;color:#C9A84C;font-weight:600;">${fmtTime(data.electionEndDate!)}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            ` : ''}

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="${data.loginUrl}"
                     style="display:inline-block;background:#0A2E1A;color:#C9A84C;text-decoration:none;font-size:15px;font-weight:700;padding:16px 48px;border-radius:50px;letter-spacing:0.4px;border:2px solid #C9A84C;">
                    Login &amp; Cast Your Vote &nbsp;&rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Security notice -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-left:4px solid #0A2E1A;border-radius:8px;padding:14px 18px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td valign="top" style="padding-right:10px;padding-top:1px;">
                        <div style="width:18px;height:18px;background:#0A2E1A;border-radius:4px;text-align:center;line-height:18px;font-size:11px;font-weight:900;color:#C9A84C;">i</div>
                      </td>
                      <td>
                        <p style="margin:0;color:#374151;font-size:12px;line-height:1.75;font-weight:600;">Security Notice</p>
                        <p style="margin:4px 0 0;color:#6B7280;font-size:12px;line-height:1.75;">
                          This email contains sensitive login credentials. Never share your password with anyone &mdash; including election officials.
                          If you did not expect this email, contact the election committee immediately.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ── Divider ─────────────────────────────────────────── -->
        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #F3F4F6;margin:0;" />
          </td>
        </tr>

        <!-- ── Footer ─────────────────────────────────────────── -->
        <tr>
          <td style="padding:24px 40px 28px;text-align:center;">
            <p style="margin:0 0 8px;color:#6B7280;font-size:12px;line-height:1.7;">
              This is an automated message from the FoodTech Student Voting Platform.<br />
              Please do not reply directly to this email.
            </p>
            <p style="margin:0;color:#D1D5DB;font-size:11px;">
              &copy; ${year} FoodTech Voting Platform &nbsp;&bull;&nbsp; University of Ibadan
            </p>
          </td>
        </tr>

        <!-- ── Bottom accent bar ──────────────────────────────── -->
        <tr>
          <td style="background:#0A2E1A;height:4px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`.trim();
}
