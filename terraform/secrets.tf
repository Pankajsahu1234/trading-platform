resource "aws_secretsmanager_secret" "backend" {
  name                    = "${var.project_name}/${var.environment}/backend"
  description             = "cripto_exchange backend env vars"
  recovery_window_in_days = 7
  tags                    = { Name = "${var.project_name}-production-backend-secret" }
}

resource "aws_secretsmanager_secret_version" "backend" {
  secret_id = aws_secretsmanager_secret.backend.id

  secret_string = jsonencode({
    NODE_ENV = "production"
    PORT     = "5000"

    # RDS — auto-built from aws_db_instance after creation
    DATABASE_URL = "mysql://${var.rds_username}:${var.rds_password}@${aws_db_instance.main.address}:3306/${var.rds_db_name}"

    # Auth
    JWT_SECRET     = var.jwt_secret
    REFRESH_SECRET = var.refresh_secret

    # Blockchain
    TRONGRID_API_KEY = var.trongrid_api_key
    ADMIN_WALLET     = var.admin_wallet
    TRON_XPUB        = var.tron_xpub
    PRIVATE_KEY      = var.private_key
    USDT_CONTRACT    = var.usdt_contract

    # S3 — no AWS keys needed, EC2 IAM role handles auth
    AWS_BUCKET_NAME = aws_s3_bucket.deposits.bucket
    AWS_REGION      = var.aws_region

    # Email
    EMAIL_HOST   = var.email_host
    EMAIL_PORT   = var.email_port
    EMAIL_USER   = var.email_user
    EMAIL_PASS   = var.email_pass
    EMAIL_FROM   = var.email_from
    EMAIL_SECURE = var.email_secure

    # CORS — fintech (via ALB) + adminpanel (via CloudFront)
    ALLOWED_ORIGINS = var.domain_name != "" ? join(",", [
      "https://${var.domain_name}",
      "https://www.${var.domain_name}",
      "https://admin.${var.domain_name}"
    ]) : join(",", [
      "http://${aws_lb.main.dns_name}",
      "https://${aws_cloudfront_distribution.adminpanel.domain_name}"
    ])

    # Email verification links
    FRONTEND_BASE_URI = var.domain_name != "" ? "https://${var.domain_name}" : "http://${aws_lb.main.dns_name}"

    # ── Used by fintech deploy script to bake API URL into client bundle ──
    # This value is exported and passed to `npm run build` as VITE_API_URL
    VITE_API_URL = var.domain_name != "" ? "https://${var.domain_name}/api" : "http://${aws_lb.main.dns_name}/api"

    # Admin panel API URL — set in adminpanel .env before local build
    ADMIN_API_URL = var.domain_name != "" ? "https://${var.domain_name}" : "http://${aws_lb.main.dns_name}"
  })

  depends_on = [
    aws_db_instance.main,
    aws_s3_bucket.deposits,
    aws_lb.main,
    aws_cloudfront_distribution.adminpanel
  ]
}
