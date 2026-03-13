data "aws_ami" "ubuntu_24" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.ubuntu_24.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.private_app_1a.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  # No public IP — access only via SSM Session Manager
  associate_public_ip_address = false

  user_data = base64encode(templatefile("${path.module}/templates/user_data.sh.tpl", {
    aws_region       = var.aws_region
    secret_name      = aws_secretsmanager_secret.backend.name
    releases_bucket  = aws_s3_bucket.releases.bucket
    project_name     = var.project_name
  }))

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.ec2_volume_size_gb
    encrypted             = true
    delete_on_termination = true
    tags                  = { Name = "${var.project_name}-ec2-root" }
  }

  # Prevent accidental termination in production
  disable_api_termination = true

  tags = { Name = "${var.project_name}-app-server" }

  depends_on = [
    aws_secretsmanager_secret_version.backend,
    aws_nat_gateway.main,
    aws_s3_bucket.releases
  ]
}
