# ─── S3 Bucket: Fintech Frontend ──────────────────────────────────────────────
resource "aws_s3_bucket" "fintech" {
  bucket = "${var.project}-${var.environment}-fintech"
  tags   = { Project = var.project, Environment = var.environment }
}

resource "aws_s3_bucket_public_access_block" "fintech" {
  bucket                  = aws_s3_bucket.fintech.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "fintech" {
  bucket = aws_s3_bucket.fintech.id
  versioning_configuration { status = "Enabled" }
}

# ─── S3 Bucket: Admin Panel ───────────────────────────────────────────────────
resource "aws_s3_bucket" "admin" {
  bucket = "${var.project}-${var.environment}-admin"
  tags   = { Project = var.project, Environment = var.environment }
}

resource "aws_s3_bucket_public_access_block" "admin" {
  bucket                  = aws_s3_bucket.admin.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "admin" {
  bucket = aws_s3_bucket.admin.id
  versioning_configuration { status = "Enabled" }
}

# ─── CloudFront OAC ───────────────────────────────────────────────────────────
resource "aws_cloudfront_origin_access_control" "fintech" {
  name                              = "${var.project}-${var.environment}-fintech-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "admin" {
  name                              = "${var.project}-${var.environment}-admin-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ─── CloudFront: Fintech ──────────────────────────────────────────────────────
resource "aws_cloudfront_distribution" "fintech" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200"
  comment             = "${var.project} ${var.environment} fintech"

  origin {
    domain_name              = aws_s3_bucket.fintech.bucket_regional_domain_name
    origin_id                = "fintech-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.fintech.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "fintech-s3"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # SPA routing — return index.html for 403/404
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Project = var.project, Environment = var.environment }
}

# ─── CloudFront: Admin ────────────────────────────────────────────────────────
resource "aws_cloudfront_distribution" "admin" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200"
  comment             = "${var.project} ${var.environment} admin"

  origin {
    domain_name              = aws_s3_bucket.admin.bucket_regional_domain_name
    origin_id                = "admin-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.admin.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "admin-s3"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Project = var.project, Environment = var.environment }
}

# ─── S3 Bucket Policies (OAC access) ─────────────────────────────────────────
resource "aws_s3_bucket_policy" "fintech" {
  bucket = aws_s3_bucket.fintech.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.fintech.arn}/*"
      Condition = {
        StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.fintech.arn }
      }
    }]
  })
}

resource "aws_s3_bucket_policy" "admin" {
  bucket = aws_s3_bucket.admin.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.admin.arn}/*"
      Condition = {
        StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.admin.arn }
      }
    }]
  })
}
