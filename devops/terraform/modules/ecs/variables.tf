variable "project"            { type = string }
variable "environment"        { type = string }
variable "aws_region"         { type = string }
variable "vpc_id"             { type = string }
variable "public_subnet_ids"  { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "secret_arn"         { type = string }
variable "ecr_image_uri" {
  type    = string
  default = "public.ecr.aws/amazonlinux/amazonlinux:latest"
}
