# ─────────────────────────────────────────────────────────────
# PROJECT
# ─────────────────────────────────────────────────────────────
variable "project_name" {
  description = "Short lowercase name used in all resource names (e.g. criptoex)"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "ap-south-1"
}

# ─────────────────────────────────────────────────────────────
# DOMAIN (optional — leave empty if you don't have one yet)
# ─────────────────────────────────────────────────────────────
variable "domain_name" {
  description = "Root domain (e.g. mycriptoapp.com). Leave blank to skip HTTPS and custom domains."
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Route53 Hosted Zone ID for automatic DNS/SSL validation. Leave blank if using another DNS provider."
  type        = string
  default     = ""
}

# ─────────────────────────────────────────────────────────────
# NETWORKING
# ─────────────────────────────────────────────────────────────
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "az_a" {
  type    = string
  default = "ap-south-1a"
}

variable "az_b" {
  type    = string
  default = "ap-south-1b"
}

# ─────────────────────────────────────────────────────────────
# EC2
# ─────────────────────────────────────────────────────────────
variable "ec2_instance_type" {
  description = "t3.medium runs both backends comfortably"
  type        = string
  default     = "t3.medium"
}

variable "ec2_volume_size_gb" {
  type    = number
  default = 30
}

# ─────────────────────────────────────────────────────────────
# RDS
# ─────────────────────────────────────────────────────────────
variable "rds_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "rds_allocated_storage" {
  type    = number
  default = 20
}

variable "rds_db_name" {
  type    = string
  default = "cripto_exchange"
}

variable "rds_username" {
  type    = string
  default = "admin"
}

variable "rds_password" {
  description = "Master DB password — strong password, min 8 chars"
  type        = string
  sensitive   = true
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ for RDS (doubles cost, adds high availability)"
  type        = bool
  default     = false
}

# ─────────────────────────────────────────────────────────────
# APP SECRETS — stored in AWS Secrets Manager
# ─────────────────────────────────────────────────────────────
variable "jwt_secret" {
  description = "JWT signing secret — minimum 64 chars"
  type        = string
  sensitive   = true
}

variable "refresh_secret" {
  description = "Refresh token secret — minimum 64 chars"
  type        = string
  sensitive   = true
}

variable "trongrid_api_key" {
  description = "TronGrid API key for blockchain ops"
  type        = string
  sensitive   = true
}

variable "admin_wallet" {
  description = "Tron admin wallet address"
  type        = string
}

variable "tron_xpub" {
  description = "Tron extended public key"
  type        = string
  sensitive   = true
}

variable "private_key" {
  description = "Tron private key for sweep operations"
  type        = string
  sensitive   = true
}

variable "usdt_contract" {
  description = "USDT TRC-20 contract address"
  type        = string
  default     = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
}

# ─────────────────────────────────────────────────────────────
# EMAIL
# ─────────────────────────────────────────────────────────────
variable "email_host" {
  type = string
}

variable "email_port" {
  type    = string
  default = "587"
}

variable "email_user" {
  type      = string
  sensitive = true
}

variable "email_pass" {
  type      = string
  sensitive = true
}

variable "email_from" {
  type = string
}

variable "email_secure" {
  type    = string
  default = "false"
}
