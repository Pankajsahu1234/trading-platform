output "fintech_domain"          { value = aws_cloudfront_distribution.fintech.domain_name }
output "admin_domain"            { value = aws_cloudfront_distribution.admin.domain_name }
output "fintech_bucket_name"     { value = aws_s3_bucket.fintech.bucket }
output "admin_bucket_name"       { value = aws_s3_bucket.admin.bucket }
output "fintech_distribution_id" { value = aws_cloudfront_distribution.fintech.id }
output "admin_distribution_id"   { value = aws_cloudfront_distribution.admin.id }
