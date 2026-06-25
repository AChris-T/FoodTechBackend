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
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function voterCredentialsTemplate(
  data: CredentialsTemplateData,
): string {
  const year = new Date().getFullYear();
  const hasElection = !!(
    data.electionTitle &&
    data.electionStartDate &&
    data.electionEndDate
  );
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
      <table width="560" cellpadding="0" cellspacing="0" border="0"
             style="max-width:560px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #E5E7EB;">

        <!-- ── Header ─────────────────────────────────────────── -->
        <tr>
          <td style="background:#0A2E1A;padding:36px 36px 32px;text-align:center;">

            <!-- Brand wordmark -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:40px;height:40px;background:#C9A84C;border-radius:8px;text-align:center;vertical-align:middle;font-size:15px;font-weight:700;color:#0A2E1A;letter-spacing:-0.5px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                        FV
                      </td>
                      <td style="padding-left:10px;text-align:left;vertical-align:middle;">
                        <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;letter-spacing:0.1px;line-height:1;">FoodTech Voting</p>
                        <p style="margin:2px 0 0;color:rgba(255,255,255,0.45);font-size:10px;letter-spacing:0.6px;text-transform:uppercase;">University of Ibadan</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:6px;">
                  <!-- Checkmark badge -->
                  <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                    <tr>
                      <td style="width:48px;height:48px;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.35);border-radius:8px;text-align:center;vertical-align:middle;">
                        <span style="font-size:20px;font-weight:600;color:#C9A84C;line-height:1;">&#10003;</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:14px;">
                  <h1 style="margin:0 0 6px;color:#ffffff;font-size:21px;font-weight:600;letter-spacing:-0.2px;line-height:1.2;">
                    You&rsquo;re Eligible to Vote
                  </h1>
                  <p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px;letter-spacing:0.2px;">
                    Your voting account has been created
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Eligibility ribbon ──────────────────────────────── -->
        <tr>
          <td style="background:#E8F5EE;border-bottom:1px solid #1B6B3A;padding:12px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="28" valign="middle">
                  <div style="width:20px;height:20px;background:#1B6B3A;border-radius:5px;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#fff;">
                    &#10003;
                  </div>
                </td>
                <td valign="middle" style="padding-left:8px;">
                  <p style="margin:0;color:#0A2E1A;font-size:12px;font-weight:600;">Voting eligibility confirmed</p>
                  <p style="margin:2px 0 0;color:#1B6B3A;font-size:11px;">You are registered and authorized to participate in the upcoming election.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Body ───────────────────────────────────────────── -->
        <tr>
          <td style="padding:32px 36px 28px;">

            <!-- Greeting -->
            <p style="margin:0 0 4px;color:#111827;font-size:17px;font-weight:600;">Hello, ${data.fullName}</p>
            <p style="margin:0 0 24px;color:#4B5563;font-size:13px;line-height:1.7;">
              Your account on the <strong style="color:#0A2E1A;font-weight:600;">FoodTech Student Voting Platform</strong> is ready.
              An important election is coming up &mdash; use the credentials below to log in and cast your vote.
            </p>

            <!-- Section label -->
            <p style="margin:0 0 10px;color:#9CA3AF;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">
              Your Login Credentials
            </p>

            <!-- Matric Number card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="background:#F8FFFE;border:1px solid #BBF7D0;border-radius:6px;padding:14px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 4px;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Matric Number &nbsp;/&nbsp; Username</p>
                        <p style="margin:0;font-size:19px;font-weight:700;color:#0A2E1A;letter-spacing:1px;font-family:'Courier New',Courier,monospace;">${data.matricNumber}</p>
                      </td>
                      <td width="32" valign="middle" align="right">
                        <div style="width:28px;height:28px;background:#E8F5EE;border-radius:6px;text-align:center;line-height:28px;font-size:13px;color:#1B6B3A;font-weight:600;">
                          #
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Password card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="background:#FFFBF0;border:1px solid #FDE68A;border-radius:6px;padding:14px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 4px;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Password</p>
                        <p style="margin:0 0 8px;font-size:19px;font-weight:700;color:#92400E;letter-spacing:2px;font-family:'Courier New',Courier,monospace;">${data.password}</p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="width:14px;height:14px;background:#D97706;border-radius:4px;text-align:center;line-height:14px;font-size:9px;font-weight:700;color:#fff;vertical-align:middle;">!</td>
                            <td style="padding-left:7px;vertical-align:middle;">
                              <p style="margin:0;font-size:11px;color:#92400E;font-weight:500;">Keep this private. You may be asked to change it on first login.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td width="32" valign="top" align="right" style="padding-top:2px;">
                        <div style="width:28px;height:28px;background:#FEF3C7;border-radius:6px;text-align:center;line-height:28px;font-size:14px;color:#D97706;font-weight:600;">
                          *
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Level card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#F9F7FF;border:1px solid #DDD6FE;border-radius:6px;padding:14px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 4px;font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Academic Level</p>
                        <p style="margin:0;font-size:17px;font-weight:700;color:#5B21B6;">${data.level}</p>
                      </td>
                      <td width="32" valign="middle" align="right">
                        <div style="width:28px;height:28px;background:#EDE9FE;border-radius:6px;text-align:center;line-height:28px;font-size:13px;color:#6D28D9;font-weight:700;">
                          L
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            ${
              hasElection
                ? `
            <!-- Election date/time card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#0A2E1A;border-radius:6px;padding:16px 18px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0;font-size:10px;color:rgba(201,168,76,0.8);text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Upcoming Election</p>
                        <p style="margin:5px 0 0;font-size:14px;font-weight:600;color:#ffffff;line-height:1.3;">${data.electionTitle}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="48%" style="background:rgba(255,255,255,0.06);border-radius:5px;padding:10px 12px;">
                              <p style="margin:0 0 3px;font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Starts</p>
                              <p style="margin:0;font-size:12px;font-weight:600;color:#ffffff;">${fmtDate(data.electionStartDate!)}</p>
                              <p style="margin:2px 0 0;font-size:11px;color:#C9A84C;font-weight:500;">${fmtTime(data.electionStartDate!)}</p>
                            </td>
                            <td width="4%"></td>
                            <td width="48%" style="background:rgba(255,255,255,0.06);border-radius:5px;padding:10px 12px;">
                              <p style="margin:0 0 3px;font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Ends</p>
                              <p style="margin:0;font-size:12px;font-weight:600;color:#ffffff;">${fmtDate(data.electionEndDate!)}</p>
                              <p style="margin:2px 0 0;font-size:11px;color:#C9A84C;font-weight:500;">${fmtTime(data.electionEndDate!)}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            `
                : ''
            }

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <a href="${data.loginUrl}"
                     style="display:inline-block;background:#0A2E1A;color:#C9A84C;text-decoration:none;font-size:13px;font-weight:600;padding:13px 32px;border-radius:6px;letter-spacing:0.2px;">
                    Login &amp; Cast Your Vote &nbsp;&rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Security notice -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-left:3px solid #0A2E1A;padding:12px 16px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td valign="top" style="padding-right:10px;padding-top:1px;">
                        <div style="width:14px;height:14px;background:#0A2E1A;border-radius:3px;text-align:center;line-height:14px;font-size:9px;font-weight:700;color:#C9A84C;">i</div>
                      </td>
                      <td>
                        <p style="margin:0;color:#374151;font-size:11px;line-height:1.6;font-weight:600;">Security Notice</p>
                        <p style="margin:3px 0 0;color:#6B7280;font-size:11px;line-height:1.6;">
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
          <td style="padding:0 36px;">
            <hr style="border:none;border-top:1px solid #F3F4F6;margin:0;" />
          </td>
        </tr>

        <!-- ── Footer ─────────────────────────────────────────── -->
        <tr>
          <td style="padding:20px 36px 24px;text-align:center;">
            <p style="margin:0 0 6px;color:#9CA3AF;font-size:11px;line-height:1.6;">
              This is an automated message from the FoodTech Student Voting Platform.<br />
              Please do not reply directly to this email.
            </p>
            <p style="margin:0;color:#D1D5DB;font-size:10px;">
              &copy; ${year} FoodTech Voting Platform &nbsp;&middot;&nbsp; University of Ibadan
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`.trim();
}
