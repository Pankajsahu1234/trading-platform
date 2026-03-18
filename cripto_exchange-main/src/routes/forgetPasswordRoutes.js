import express from 'express'
import authMiddleware  from '../middlewares/authMiddleware.js'
import { forgotPassword ,verifyResetOtp,resetPassword} from '../controllers/forgetPasswor.controller.js'
const router = express.Router()

// Public routes
router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-otp', verifyResetOtp)

// Protected routes
router.post('/set-password', authMiddleware, resetPassword)

export default router
