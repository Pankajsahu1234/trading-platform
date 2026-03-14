output "alb_dns_name" {
  description = "Backend ALB DNS — use this as API base URL until domain is configured"
  value       = module.ecs.alb_dns_name
}

output "fintech_cloudfront_domain" {
  description = "Frontend CloudFront URL"
  value       = module.cloudfront.fintech_domain
}

output "admin_cloudfront_domain" {
  description = "Admin panel CloudFront URL"
  value       = module.cloudfront.admin_domain
}

output "ecr_repository_url" {
  description = "ECR repo URL — use in GitHub Actions"
  value       = module.ecs.ecr_repository_url
}

output "fintech_s3_bucket" {
  description = "S3 bucket for frontend deployment"
  value       = module.cloudfront.fintech_bucket_name
}

output "admin_s3_bucket" {
  description = "S3 bucket for admin panel deployment"
  value       = module.cloudfront.admin_bucket_name
}

output "fintech_cf_distribution_id" {
  description = "CloudFront distribution ID for fintech (cache invalidation)"
  value       = module.cloudfront.fintech_distribution_id
}

output "admin_cf_distribution_id" {
  description = "CloudFront distribution ID for admin (cache invalidation)"
  value       = module.cloudfront.admin_distribution_id
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}
