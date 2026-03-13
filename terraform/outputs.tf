# ─────────────────────────────────────────────────────────────
# OUTPUTS — run: terraform output
# ─────────────────────────────────────────────────────────────

# ── EC2 ──────────────────────────────────────────────────────
output "ec2_instance_id" {
  description = "EC2 instance ID — use for SSM access"
  value       = aws_instance.app.id
}

output "ssm_connect_command" {
  description = "Run this to connect to EC2 via SSM (no SSH key needed)"
  value       = "aws ssm start-session --target ${aws_instance.app.id} --region ${var.aws_region}"
}

# ── ALB ──────────────────────────────────────────────────────
output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "vite_api_url_for_frontends" {
  description = "Set as VITE_API_URL in adminpanel .env before local build"
  value       = var.domain_name != "" ? "https://${var.domain_name}/api" : "http://${aws_lb.main.dns_name}/api"
}

# ── RDS ──────────────────────────────────────────────────────
output "rds_endpoint" {
  description = "RDS endpoint (private — only reachable from EC2)"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  value = aws_db_instance.main.port
}

# ── S3 ───────────────────────────────────────────────────────
output "s3_deposits_bucket" {
  description = "S3 bucket for deposit screenshots"
  value       = aws_s3_bucket.deposits.bucket
}

output "s3_releases_bucket" {
  description = "Upload cripto_exchange.zip and fintech.zip here before deploying"
  value       = aws_s3_bucket.releases.bucket
}

output "s3_adminpanel_bucket" {
  description = "Upload adminpanel build (dist/) to this bucket"
  value       = aws_s3_bucket.adminpanel.bucket
}

output "adminpanel_upload_command" {
  description = "Run locally after: cd adminpanel-main && npm run build"
  value       = "aws s3 sync ./dist s3://${aws_s3_bucket.adminpanel.bucket} --delete --region ${var.aws_region}"
}

# ── CloudFront ───────────────────────────────────────────────
output "adminpanel_url" {
  description = "Admin panel URL"
  value       = var.domain_name != "" ? "https://admin.${var.domain_name}" : "https://${aws_cloudfront_distribution.adminpanel.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Use for cache invalidation after adminpanel redeploy"
  value       = aws_cloudfront_distribution.adminpanel.id
}

output "cloudfront_invalidation_command" {
  description = "Run after uploading new adminpanel build"
  value       = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.adminpanel.id} --paths '/*'"
}

# ── Fintech ──────────────────────────────────────────────────
output "fintech_url" {
  description = "Main website URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "http://${aws_lb.main.dns_name}"
}

# ── Secrets Manager ──────────────────────────────────────────
output "secrets_manager_secret_name" {
  description = "Secret name — referenced in deploy scripts"
  value       = aws_secretsmanager_secret.backend.name
}

# ── ACM DNS Validation (only when domain is set) ─────────────
output "acm_validation_records_alb" {
  description = "Add these CNAME records in your DNS to validate the SSL cert"
  value = var.domain_name != "" ? {
    for dvo in aws_acm_certificate.alb[0].domain_validation_options :
    dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  } : {}
}

# ── Next Steps ───────────────────────────────────────────────
output "next_steps" {
  description = "What to do after terraform apply"
  value       = <<-STEPS
  ──────────────────────────────────────────────────────
  STEP 1 — Upload code (run LOCALLY):
    bash terraform/scripts/upload-code.sh

  STEP 2 — Connect to EC2:
    aws ssm start-session --target ${aws_instance.app.id} --region ${var.aws_region}

  STEP 3 — Deploy backend (on EC2):
    sudo bash /home/ubuntu/deploy-cripto.sh

  STEP 4 — Deploy frontend (on EC2):
    sudo bash /home/ubuntu/deploy-fintech.sh

  STEP 5 — Build & deploy admin panel (LOCALLY):
    cd adminpanel-main
    VITE_API_URL="${var.domain_name != "" ? "https://${var.domain_name}/api" : "http://${aws_lb.main.dns_name}/api"}" npm run build
    aws s3 sync ./dist s3://${aws_s3_bucket.adminpanel.bucket} --delete --region ${var.aws_region}
    aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.adminpanel.id} --paths '/*'

  Main site:   ${var.domain_name != "" ? "https://${var.domain_name}" : "http://${aws_lb.main.dns_name}"}
  Admin panel: ${var.domain_name != "" ? "https://admin.${var.domain_name}" : "https://${aws_cloudfront_distribution.adminpanel.domain_name}"}
  ──────────────────────────────────────────────────────
  STEPS
}
