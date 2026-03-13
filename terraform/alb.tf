resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_1a.id, aws_subnet.public_1b.id]

  enable_deletion_protection = true

  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "alb"
    enabled = true
  }

  tags = { Name = "${var.project_name}-alb" }

  depends_on = [aws_s3_bucket_policy.alb_logs]
}

# ── Target Groups ─────────────────────────────────────────────

resource "aws_lb_target_group" "cripto" {
  name        = "${var.project_name}-tg-cripto"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    path                = "/health"
    port                = "5000"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = { Name = "${var.project_name}-tg-cripto" }
}

resource "aws_lb_target_group" "fintech" {
  name        = "${var.project_name}-tg-fintech"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    path                = "/api/ping"
    port                = "3000"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = { Name = "${var.project_name}-tg-fintech" }
}

# ── Listeners ─────────────────────────────────────────────────

# HTTP listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  # With domain → redirect to HTTPS
  dynamic "default_action" {
    for_each = var.domain_name != "" ? [1] : []
    content {
      type = "redirect"
      redirect {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  }

  # Without domain → forward to fintech
  dynamic "default_action" {
    for_each = var.domain_name == "" ? [1] : []
    content {
      type             = "forward"
      target_group_arn = aws_lb_target_group.fintech.arn
    }
  }

  tags = { Name = "${var.project_name}-listener-http" }
}

# /api/* rule for HTTP (no-domain mode)
resource "aws_lb_listener_rule" "cripto_http" {
  count        = var.domain_name == "" ? 1 : 0
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cripto.arn
  }

  condition {
    path_pattern { values = ["/api/*", "/health"] }
  }

  tags = { Name = "${var.project_name}-rule-cripto-http" }
}

# HTTPS listener (with domain only)
resource "aws_lb_listener" "https" {
  count             = var.domain_name != "" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.alb[0].arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fintech.arn
  }

  tags = { Name = "${var.project_name}-listener-https" }
}

# /api/* rule for HTTPS
resource "aws_lb_listener_rule" "cripto_https" {
  count        = var.domain_name != "" ? 1 : 0
  listener_arn = aws_lb_listener.https[0].arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cripto.arn
  }

  condition {
    path_pattern { values = ["/api/*", "/health"] }
  }

  tags = { Name = "${var.project_name}-rule-cripto-https" }
}

# ── Register EC2 in both TGs ──────────────────────────────────

resource "aws_lb_target_group_attachment" "cripto" {
  target_group_arn = aws_lb_target_group.cripto.arn
  target_id        = aws_instance.app.id
  port             = 5000
}

resource "aws_lb_target_group_attachment" "fintech" {
  target_group_arn = aws_lb_target_group.fintech.arn
  target_id        = aws_instance.app.id
  port             = 3000
}
