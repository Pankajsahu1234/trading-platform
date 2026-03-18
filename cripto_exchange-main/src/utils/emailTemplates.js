function emailVerificationTemplate(otp) {
  return `
     <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px;">
        <div style="max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.08);">
          <h1 style="color: #c9a227; font-size: 24px; margin-bottom: 4px;">Timofx</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 0;">Professional Investment Platform</p>
          <hr style="border-color: rgba(255,255,255,0.08); margin: 24px 0;" />
          <h2 style="font-size: 20px; margin-bottom: 8px;">Verify Your Email</h2>
          <p style="color: #94a3b8; font-size: 14px;">Use the OTP below to verify your email address. It expires in <strong style="color:#e2e8f0;">10 minutes</strong>.</p>
          <div style="text-align:center; margin: 32px 0;">
            <span style="display:inline-block; letter-spacing: 12px; font-size: 36px; font-weight: bold; color: #c9a227; background: rgba(201,162,39,0.1); padding: 16px 24px; border-radius: 8px; border: 1px solid rgba(201,162,39,0.3);">
              ${otp}
            </span>
          </div>
          <p style="color: #64748b; font-size: 12px;">If you didn't create a Timofx account, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
  `;
}

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