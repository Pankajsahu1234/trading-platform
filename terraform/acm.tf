# ── ACM cert for ALB — ap-south-1 ────────────────────────────
resource "aws_acm_certificate" "alb" {
  count             = var.domain_name != "" ? 1 : 0
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}",
    "api.${var.domain_name}"
  ]

  lifecycle { create_before_destroy = true }
  tags = { Name = "${var.project_name}-cert-alb" }
}

# ── ACM cert for CloudFront — MUST be in us-east-1 ───────────
resource "aws_acm_certificate" "cloudfront" {
  count             = var.domain_name != "" ? 1 : 0
  provider          = aws.us_east_1
  domain_name       = "admin.${var.domain_name}"
  validation_method = "DNS"

  lifecycle { create_before_destroy = true }
  tags = { Name = "${var.project_name}-cert-cf" }
}

# ── DNS Validation (Route53) ──────────────────────────────────
# Only created if you set route53_zone_id in tfvars
# If using another DNS provider, skip these and add CNAMEs manually
resource "aws_route53_record" "alb_cert_validation" {
  for_each = var.route53_zone_id != "" && var.domain_name != "" ? {
    for dvo in aws_acm_certificate.alb[0].domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.route53_zone_id
}

resource "aws_acm_certificate_validation" "alb" {
  count                   = var.route53_zone_id != "" && var.domain_name != "" ? 1 : 0
  certificate_arn         = aws_acm_certificate.alb[0].arn
  validation_record_fqdns = [for record in aws_route53_record.alb_cert_validation : record.fqdn]
}

resource "aws_route53_record" "cloudfront_cert_validation" {
  for_each = var.route53_zone_id != "" && var.domain_name != "" ? {
    for dvo in aws_acm_certificate.cloudfront[0].domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  provider        = aws.us_east_1
  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.route53_zone_id
}

resource "aws_acm_certificate_validation" "cloudfront" {
  count                   = var.route53_zone_id != "" && var.domain_name != "" ? 1 : 0
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.cloudfront[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cloudfront_cert_validation : record.fqdn]
}
