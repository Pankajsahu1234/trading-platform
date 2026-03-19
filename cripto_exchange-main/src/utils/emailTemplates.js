//---------------------------- Email Verification Template ---------------------------------------------
function emailVerificationTemplate(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TIMO FX - Verify Your Identity</title>
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    @keyframes gridMove {
      0%   { transform: translateY(0); }
      100% { transform: translateY(40px); }
    }
    @keyframes gridMoveX {
      0%   { transform: translateX(0); }
      100% { transform: translateX(40px); }
    }
    .grid-h { animation: gridMove 4s linear infinite; }
    .grid-v { animation: gridMoveX 4s linear infinite; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#070b12;font-family:'Inter',sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#070b12;">
  <tr>
    <td align="center" style="padding:48px 16px;">

      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

        <!-- PRE-HEADER -->
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <span style="font-size:11px;color:#2a3050;letter-spacing:3px;text-transform:uppercase;">Secure Communication · timofx.com</span>
          </td>
        </tr>

        <!-- CARD -->
        <tr>
          <td style="border-radius:24px;overflow:hidden;border:1px solid #1a2035;box-shadow:0 24px 80px rgba(0,0,0,0.7);">

            <!-- ANIMATED GRID HEADER BANNER -->
            <div style="position:relative;background:#070b12;overflow:hidden;height:130px;">
              <svg style="position:absolute;top:0;left:0;width:100%;height:200%;opacity:0.12;" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hlines" x="0" y="0" width="580" height="40" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="580" y2="0" stroke="#f0c040" stroke-width="0.5"/>
                  </pattern>
                  <pattern id="vlines" x="0" y="0" width="40" height="260" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="260" stroke="#f0c040" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hlines)" class="grid-h"/>
                <rect width="100%" height="100%" fill="url(#vlines)" class="grid-v"/>
              </svg>
              <div style="position:absolute;top:0;left:0;width:100%;height:50%;background:linear-gradient(180deg,#070b12 0%,transparent 100%);"></div>
              <div style="position:absolute;bottom:0;left:0;width:100%;height:60%;background:linear-gradient(0deg,#0f1420 0%,transparent 100%);"></div>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:60px;background:radial-gradient(ellipse,rgba(240,192,64,0.08) 0%,transparent 70%);"></div>

              <!-- LOGO -->
              <table width="100%" cellpadding="0" cellspacing="0" style="position:relative;z-index:2;">
                <tr>
                  <td align="center" style="padding-top:32px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <div style="width:44px;height:44px;background:linear-gradient(145deg,#b8860b,#f0c040);border-radius:12px;text-align:center;line-height:44px;display:inline-block;">
                            <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:22px;color:#070b12;">T</span>
                          </div>
                        </td>
                        <td style="padding-left:13px;vertical-align:middle;">
                          <div style="font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700;color:#f0c040;letter-spacing:3px;line-height:1.1;">TIMO<span style="color:#ffffff;"> FX</span></div>
                          <div style="font-size:9px;color:#4a5568;letter-spacing:4px;text-transform:uppercase;margin-top:1px;">Trading Platform</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>

            <!-- TOP GOLD LINE -->
            <div style="height:3px;background:linear-gradient(90deg,#7a5500,#c9a227,#f0c040,#c9a227,#7a5500);"></div>

            <!-- BODY -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(160deg,#0f1420 0%,#0c1018 100%);">
              <tr>
                <td style="padding:36px 44px 20px;">

                  <h1 style="font-family:'Rajdhani',sans-serif;font-size:34px;font-weight:700;color:#ffffff;margin:0 0 12px;letter-spacing:0.5px;line-height:1.2;white-space:nowrap;">
                    Verify Your <span style="color:#f0c040;">TIMO Account</span>
                  </h1>

                  <p style="font-size:14px;color:#6b7a9a;margin:0 0 28px;line-height:1.8;">
                    Hello <strong style="color:#c8d0e0;font-weight:500;">User</strong>, a sign-in attempt was detected on your account. Enter the one-time password below to continue securely.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 auto 24px auto;">
                    <tr>
                      <td style="background:linear-gradient(135deg,#0e1520,#131c2b);border:1px solid #f0c04035;border-radius:20px;padding:24px 20px;text-align:center;">
                        <div style="font-size:9px;color:#3a4560;letter-spacing:4px;text-transform:uppercase;margin-bottom:11px;">One-Time Password</div>
                        <div style="font-family:'Rajdhani',sans-serif;font-size:43px;font-weight:700;color:#f0c040;letter-spacing:20px;padding:0 6px;">${otp}</div>
                        <div style="height:1px;background:linear-gradient(90deg,transparent,#f0c04020,transparent);margin:13px auto;max-width:144px;"></div>
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td style="background:#0a1020;border:1px solid #1e2a40;border-radius:20px;padding:4px 13px;">
                              <span style="font-size:10px;color:#6b7a9a;letter-spacing:1px;">⏱ &nbsp;Expires in <strong style="color:#f0c040;">10 minutes</strong></span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <tr>
                <td style="padding:0 44px 36px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#0f1420;border:1px solid #ffffff20;border-radius:20px;padding:18px 22px;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="28" style="vertical-align:top;padding-top:1px;">
                              <span style="font-size:16px;">⚠️</span>
                            </td>
                            <td style="padding-left:10px;">
                              <div style="font-size:12px;font-weight:600;color:#e2e8f0;margin-bottom:4px;letter-spacing:0.5px;">Security Notice</div>
                              <div style="font-size:12px;color:#a0aec0;line-height:1.7;">Never share this OTP with anyone. If you did not initiate this request, please ignore this email and your account will be safe .</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 44px;">
                  <div style="height:1px;background:linear-gradient(90deg,transparent,#1a2035,transparent);"></div>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 44px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <div style="font-size:11px;color:#6b7a9a;line-height:2;">
                          © 2026 <strong style="color:#8892a4;">TIMO FX</strong> · All rights reserved
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>

          </td>
        </tr>

        <tr>
          <td align="center" style="padding-top:22px;">
            <span style="font-size:11px;color:#1e2535;">This is an automated message. Please do not reply to this email.</span>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
  `;
}


//--------------------------- 2FA Email Templates ---------------------------------------------
// src/utils/emailTemplates.js
function twoFactorSetupTemplate() {  // Ab qrCodeUrl pass nahi karna, baad mein handle karenge
  return `
    <html>
      <body>
        <h1>2FA Setup</h1>
        <p>Scan this QR code with your authenticator app (e.g., Google Authenticator):</p>
        <img src="cid:qr-code" alt="QR Code" style="max-width: 200px;" />
        <p>If the image doesn't show, enable "Display images" in Gmail settings or reply for help.</p>
      </body>
    </html>
  `;
}


//---------------------------- 2FA Login Alert Template ---------------------------------------------
function twoFactorLoginTemplate() {
  return `
    <html>
      <body>
        <h1>2FA Login Alert</h1>
        <p>A login attempt was made to your account. If this was you, proceed with the 2FA code from your app.</p>
      </body>
    </html>
  `;
}

export  {
  emailVerificationTemplate,
  twoFactorSetupTemplate,
  twoFactorLoginTemplate,
};