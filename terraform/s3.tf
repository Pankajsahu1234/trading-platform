# ── S3: Deposit Screenshots (private) ────────────────────────
resource "aws_s3_bucket" "deposits" {
  bucket = "${var.project_name}-deposits-${random_id.suffix.hex}"
  tags   = { Name = "${var.project_name}-deposits" }
}

resource "aws_s3_bucket_versioning" "deposits" {
  bucket = aws_s3_bucket.deposits.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "deposits" {
  bucket = aws_s3_bucket.deposits.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "deposits" {
  bucket                  = aws_s3_bucket.deposits.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "deposits" {
  bucket = aws_s3_bucket.deposits.id
  rule {
    id     = "archive-old-screenshots"
    status = "Enabled"
    filter {}
    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }
    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }
}

# ── S3: Code Releases (EC2 deployment source) ─────────────────
# Upload cripto_exchange.zip and fintech.zip here before running deploy
resource "aws_s3_bucket" "releases" {
  bucket = "${var.project_name}-releases-${random_id.suffix.hex}"
  tags   = { Name = "${var.project_name}-releases" }
}

resource "aws_s3_bucket_versioning" "releases" {
  bucket = aws_s3_bucket.releases.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "releases" {
  bucket = aws_s3_bucket.releases.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "releases" {
  bucket                  = aws_s3_bucket.releases.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "releases" {
  bucket = aws_s3_bucket.releases.id
  rule {
    id     = "expire-old-releases"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration { noncurrent_days = 30 }
  }
}

# ── S3: Admin Panel Static Site (CloudFront OAC only) ────────
resource "aws_s3_bucket" "adminpanel" {
  bucket = "${var.project_name}-adminpanel-${random_id.suffix.hex}"
  tags   = { Name = "${var.project_name}-adminpanel" }
}

resource "aws_s3_bucket_versioning" "adminpanel" {
  bucket = aws_s3_bucket.adminpanel.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "adminpanel" {
  bucket = aws_s3_bucket.adminpanel.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "adminpanel" {
  bucket                  = aws_s3_bucket.adminpanel.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Only CloudFront OAC can read — no direct S3 URL access
resource "aws_s3_bucket_policy" "adminpanel" {
  bucket = aws_s3_bucket.adminpanel.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudFrontOAC"
      Effect = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action   = "s3:GetObject"
      Resource = "${aws_s3_bucket.adminpanel.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.adminpanel.arn
        }
      }
    }]
  })

  depends_on = [aws_s3_bucket_public_access_block.adminpanel]
}

# ── S3: ALB Access Logs ───────────────────────────────────────
resource "aws_s3_bucket" "alb_logs" {
  bucket        = "${var.project_name}-alb-logs-${random_id.suffix.hex}"
  force_destroy = true
  tags          = { Name = "${var.project_name}-alb-logs" }
}

resource "aws_s3_bucket_public_access_block" "alb_logs" {
  bucket                  = aws_s3_bucket.alb_logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_elb_service_account" "main" {}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = data.aws_elb_service_account.main.arn }
      Action    = "s3:PutObject"
      Resource  = "${aws_s3_bucket.alb_logs.arn}/alb/AWSLogs/*"
    }]
  })
}
