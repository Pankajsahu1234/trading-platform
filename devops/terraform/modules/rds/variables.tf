variable "project"            { type = string }
variable "environment"        { type = string }
variable "vpc_id"             { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "ecs_sg_id"          { type = string }
variable "db_name" {
  type    = string
  default = "criptodb"
}
variable "db_username" {
  type    = string
  default = "admin"
}
variable "db_password" {
  type      = string
  sensitive = true
}

variable "bastion_sg_id" {
  description = "Security group ID of EC2 bastion host"
  type        = string
  default     = "sg-0b66658d29d0d87c1"
}
