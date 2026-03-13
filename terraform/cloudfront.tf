resource "aws_cloudfront_origin_access_control" "adminpanel" {
  name                              = "${var.project_name}-adminpanel-oac"
  description                       = "OAC for adminpanel S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "adminpanel" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} adminpanel"
  default_root_object = "index.html"
  price_class         = "PriceClass_200"
  aliases = var.domain_name != "" ? ["admin.${var.domain_name}"] : []

  # S3 origin — serves static React files
  origin {
    domain_name              = aws_s3_bucket.adminpanel.bucket_regional_domain_name
    origin_id                = "s3-adminpanel"
    origin_access_control_id = aws_cloudfront_origin_access_control.adminpanel.id
  }

  # ALB origin — serves /api/* requests
  origin {
    domain_name = "criptoex-alb-1854728373.ap-south-1.elb.amazonaws.com"
    origin_id   = "alb-api-admin"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # /api/* → ALB (must be before default_cache_behavior)
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "alb-api-admin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type", "Origin"]
      cookies { forward = "all" }
    }
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # index.html — never cache (always fetch fresh React entry point)
  ordered_cache_behavior {
    path_pattern           = "index.html"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-adminpanel"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-adminpanel"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  # React Router SPA — 404/403 from S3 → return index.html
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  viewer_certificate {
    acm_certificate_arn            = var.domain_name != "" ? aws_acm_certificate.cloudfront[0].arn : null
    cloudfront_default_certificate = var.domain_name == "" ? true : false
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
    minimum_protocol_version       = var.domain_name != "" ? "TLSv1.2_2021" : "TLSv1"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  tags = { Name = "${var.project_name}-cf-adminpanel" }

  depends_on = [aws_s3_bucket_public_access_block.adminpanel]
}
