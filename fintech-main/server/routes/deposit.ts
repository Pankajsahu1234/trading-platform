import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory, or use disk storage as needed
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const validMimes = ["image/jpeg", "image/png", "image/webp"];
    if (validMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  },
});

const router = Router();

/**
 * POST /api/deposit/submit
 * Handles deposit transaction submission with screenshot validation
 */
router.post(
  "/submit",
  upload.single("screenshot"),
  (req: Request, res: Response) => {
    try {
      console.log("=== Deposit Submit Request ===");
      console.log("Body:", req.body);
      console.log(
        "File:",
        req.file
          ? {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype,
            }
          : null,
      );

      // Validate required fields
      const { amount, tx_hash } = req.body;

      if (!amount) {
        return res.status(400).json({
          success: false,
          error: "Amount is required",
        });
      }

      if (!tx_hash) {
        return res.status(400).json({
          success: false,
          error: "Transaction hash is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Screenshot is required",
        });
      }

      // Validate amount
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum < 10) {
        return res.status(400).json({
          success: false,
          error: "Minimum deposit amount is $10 USDT",
        });
      }

      // Validate transaction hash
      if (tx_hash.length < 60) {
        return res.status(400).json({
          success: false,
          error: "Invalid transaction hash",
        });
      }

      // TODO: Process the deposit
      // - Store file in storage (S3, Azure Blob, or local fs)
      // - Create deposit record in database
      // - Update user wallet balance (if immediate)
      // - Send confirmation email

      console.log("Deposit submission successful:", {
        amount: amountNum,
        tx_hash,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });

      return res.status(200).json({
        success: true,
        message:
          "Deposit submitted successfully. Your transaction will be verified within 5-10 minutes.",
        depositId: `DEP_${Date.now()}`, // placeholder
      });
    } catch (error: any) {
      console.error("Error processing deposit:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to process deposit",
      });
    }
  },
);

export const depositRoutes = router;
