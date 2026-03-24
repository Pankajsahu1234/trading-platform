resource "aws_secretsmanager_secret" "app" {
  name                    = "${var.project}/${var.environment}/app-secrets"
  description             = "All env vars for ${var.project} ${var.environment}"
  recovery_window_in_days = 7
  tags = { Project = var.project, Environment = var.environment }
}
resource "aws_secretsmanager_secret_version" "app" {
  secret_id     = aws_secretsmanager_secret.app.id
  secret_string = jsonencode(var.secrets)

  lifecycle {
    ignore_changes = [secret_string]
  }
}
