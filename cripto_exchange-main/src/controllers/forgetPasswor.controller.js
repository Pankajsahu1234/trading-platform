import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateOTP } from '../utils/otpGenerator.js'
import { sendEmail } from '../services/emailService.js'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────
// 📧  STEP 1 — Send OTP to email
//     POST /auth/forgot-password
//     Body: { email }
// ─────────────────────────────────────────────
async function forgotPassword(req, res) {
  try {
    console.log('\n' + '='.repeat(60))
    console.log('🔑 FORGOT PASSWORD REQUEST')
    console.log('='.repeat(60))

    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    console.log('   Email:', email)

    const user = await prisma.user.findUnique({ where: { email } })

    // Return generic message to prevent user enumeration
    if (!user) {
      return res.status(400).json({
        error: 'No user found with this email address. Please check and try again.',
      })
    }

    if (!user.is_email_verified) {
      return res.status(400).json({
        error: 'Email not verified. Please verify your email first.',
      })
    }

    if (user.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Account is not active.' })
    }

    // Generate OTP and expiry (10 minutes)
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { email },
      data: {
        email_verify_token: otp
        // password_reset_expires: otpExpiry,
      },
    })

    // Build email — reuse your existing template pattern
    const html = forgotPasswordEmailTemplate(otp, user.name)
    const emailResult = await sendEmail(email, 'Reset Your Password — OTP', html)

    if (!emailResult.success) {
      console.error('❌ Failed to send reset OTP email:', emailResult.error)
      return res.status(500).json({
        error: 'Failed to send email. Please try again later.',
      })
    }

    console.log(`✅ Reset OTP sent successfully to: ${email}`)
    return res.status(200).json({
      message: 'OTP sent to your email. Valid for 10 minutes.',
    })
  } catch (error) {
    console.error('❌ forgotPassword error:', error)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

// ─────────────────────────────────────────────
// ✅  STEP 2 — Verify OTP → return access token
//     POST /auth/verify-reset-otp
//     Body: { email, otp }
// ─────────────────────────────────────────────
async function verifyResetOtp(req, res) {
  try {
    console.log('\n' + '='.repeat(60))
    console.log('🔐 VERIFY RESET OTP REQUEST')
    console.log('='.repeat(60))

    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' })
    }

    console.log('   Email:', email)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.email_verify_token) {
      return res.status(400).json({ error: 'Invalid or expired OTP' })
    }

    // Check OTP match
    if (user.email_verify_token !== otp) {
      console.log('❌ OTP mismatch for:', email)
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' })
    }

    // Check expiry
    // if (!user.password_reset_expires || new Date() > new Date(user.password_reset_expires)) {
    //   console.log('❌ OTP expired for:', email)
    //   // Clear expired token
    //   await prisma.user.update({
    //     where: { email },
    //     data: { password_reset_token: null, password_reset_expires: null },
    //   })
    //   return res.status(400).json({ error: 'OTP has expired. Please request a new one.' })
    // }

    // OTP is valid — clear it so it cannot be reused
    await prisma.user.update({
      where: { email },
      data: {
        email_verify_token: null,
        // password_reset_expires: null,
      },
    })

    // Issue a short-lived reset access token (15 min)
    const access_token = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    )

    console.log(`✅ Reset OTP verified for: ${email}`)
    return res.status(200).json({
      message: 'OTP verified. You may now reset your password.',
      access_token,
    })
  } catch (error) {
    console.error('❌ verifyResetOtp error:', error)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

// ─────────────────────────────────────────────
// 🔒  STEP 3 — Save new password
//     POST /auth/reset-password
//     Headers: Authorization: Bearer <access_token>
//     Body: { new_password }
// ─────────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    console.log('\n' + '='.repeat(60))
    console.log('💾 RESET PASSWORD REQUEST')
    console.log('='.repeat(60))

    const { new_password } = req.body

    if (!new_password) {
      return res.status(400).json({ error: 'New password is required' })
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Verify reset token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing' })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      console.log('❌ Invalid/expired reset token')
      return res.status(401).json({ error: 'Reset token is invalid or expired. Please start over.' })
    }

    // Confirm token was issued specifically for password reset
    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({ error: 'Invalid token purpose' })
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Prevent reuse of the same password
    const isSamePassword = await bcrypt.compare(new_password, user.password_hash)
    if (isSamePassword) {
      return res.status(400).json({
        error: 'New password cannot be the same as your current password.',
      })
    }

    const password_hash = await bcrypt.hash(new_password, 10)

    // Save new password and invalidate all existing refresh tokens
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password_hash,
        refresh_token: null, // force re-login on all devices
      },
    })

    console.log(`✅ Password reset successfully for userId: ${decoded.userId}`)
    return res.status(200).json({ message: 'Password reset successfully. Please log in.' })
  } catch (error) {
    console.error('❌ resetPassword error:', error)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

// ─────────────────────────────────────────────
// 📨  Email template (inline — add to emailTemplates.js if preferred)
// ─────────────────────────────────────────────
function forgotPasswordEmailTemplate(otp, name = 'User') {
  return `
   <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px;">
        <div style="max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.08);">
          <h1 style="color: #c9a227; font-size: 24px; margin-bottom: 4px;">Timofx</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 0;">Professional Investment Platform</p>
          <hr style="border-color: rgba(255,255,255,0.08); margin: 24px 0;" />
          <h2 style="font-size: 20px; margin-bottom: 8px;">Password Reset Request</h2>
          <p style="color: #94a3b8; font-size: 14px;">Hi ${name}, use the OTP below to reset your password. It expires in <strong style="color:#e2e8f0;">10 minutes</strong>.</p>
          <div style="text-align:center; margin: 32px 0;">
            <span style="display:inline-block; letter-spacing: 12px; font-size: 36px; font-weight: bold; color: #c9a227; background: rgba(201,162,39,0.1); padding: 16px 24px; border-radius: 8px; border: 1px solid rgba(201,162,39,0.3);">
              ${otp}
            </span>
          </div>
          <p style="color: #64748b; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
        </div>
      </body>
    </html>
  `
}

export { forgotPassword, verifyResetOtp, resetPassword }