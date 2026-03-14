variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "project" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "cripto"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "RDS master password — set via TF_VAR_db_password or tfvars"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "RDS database name"
  type        = string
  default     = "criptodb"
}

variable "jwt_secret" {
  description = "JWT signing secret (min 32 chars)"
  type        = string
  sensitive   = true
}

variable "email_host" {
  description = "SMTP host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "email_port" {
  description = "SMTP port"
  type        = string
  default     = "587"
}

variable "email_user" {
  description = "SMTP username / email address"
  type        = string
}

variable "email_pass" {
  description = "SMTP password / app password"
  type        = string
  sensitive   = true
}

variable "email_from" {
  description = "From email address"
  type        = string
}

variable "ecr_image_uri" {
  description = "ECR image URI — set by CI after first push"
  type        = string
  default     = "placeholder"
}
