output "ecr_repository_url"  { value = aws_ecr_repository.backend.repository_url }
output "alb_dns_name"         { value = aws_lb.main.dns_name }
output "alb_arn"              { value = aws_lb.main.arn }
output "cluster_name"         { value = aws_ecs_cluster.main.name }
output "service_name"         { value = aws_ecs_service.backend.name }
output "ecs_sg_id"            { value = aws_security_group.ecs.id }
output "uploads_bucket_name"  { value = aws_s3_bucket.uploads.bucket }
output "task_definition_family" { value = aws_ecs_task_definition.backend.family }
