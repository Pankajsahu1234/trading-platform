terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — S3 bucket + DynamoDB lock
  # Run bootstrap/init.sh ONCE before terraform init
  backend "s3" {
    bucket         = "cripto-tfstate-prod"
    key            = "prod/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "cripto-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── VPC ──────────────────────────────────────────────────────────────────────
module "vpc" {
  source = "../../modules/vpc"

  project     = var.project
  environment = var.environment
  vpc_cidr    = "10.0.0.0/16"
}

# ─── RDS ──────────────────────────────────────────────────────────────────────
module "rds" {
  source = "../../modules/rds"

  project            = var.project
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  ecs_sg_id          = module.ecs.ecs_sg_id
  db_password        = var.db_password
}

# ─── Secrets Manager ──────────────────────────────────────────────────────────
module "secrets" {
  source = "../../modules/secrets"

  project     = var.project
  environment = var.environment

  secrets = {
    DATABASE_URL       = "mysql://${var.db_username}:${var.db_password}@${module.rds.db_endpoint}/${var.db_name}?sslaccept=strict"
    JWT_SECRET         = var.jwt_secret
    NODE_ENV           = "production"
    PORT               = "5000"
    ALLOWED_ORIGINS    = "https://${module.cloudfront.fintech_domain},https://${module.cloudfront.admin_domain}"
    EMAIL_HOST         = var.email_host
    EMAIL_PORT         = var.email_port
    EMAIL_SECURE       = "false"
    EMAIL_USER         = var.email_user
    EMAIL_PASS         = var.email_pass
    EMAIL_FROM         = var.email_from
    AWS_BUCKET_NAME    = module.ecs.uploads_bucket_name
    AWS_REGION         = var.aws_region
  }
}

# ─── ECS Fargate (Backend) ────────────────────────────────────────────────────
module "ecs" {
  source = "../../modules/ecs"

  project            = var.project
  environment        = var.environment
  aws_region         = var.aws_region
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  secret_arn         = module.secrets.secret_arn
  ecr_image_uri      = var.ecr_image_uri
}

# ─── CloudFront + S3 (Frontend + Admin) ───────────────────────────────────────
module "cloudfront" {
  source = "../../modules/cloudfront"

  project     = var.project
  environment = var.environment
}
