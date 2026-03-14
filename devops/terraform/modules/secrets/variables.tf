variable "project"     { type = string }
variable "environment" { type = string }
variable "secrets" {
  type      = map(string)
  sensitive = true
}
