# ─────────────────────────────────────────────────────────────
# Copy to terraform.tfvars and fill all values:
#   cp terraform.tfvars.example terraform.tfvars
# ─────────────────────────────────────────────────────────────

project_name = "criptoex"     # short, lowercase, no spaces
environment  = "production"
aws_region   = "ap-south-1"

# ─── Domain (optional) ─────────────────────────────────────
# Leave blank to use ALB DNS name (HTTP only, no SSL)
# Once you add a domain, HTTPS is enabled on ALB + CloudFront
domain_name     = ""                # e.g. "mycriptoapp.com"
route53_zone_id = ""                # e.g. "Z1D633PJN98FT9" — leave blank if not using Route53

# ─── EC2 ───────────────────────────────────────────────────
ec2_instance_type  = "t3.medium"   # 2 vCPU, 4GB RAM — runs both apps comfortably
ec2_volume_size_gb = 30

# ─── RDS ───────────────────────────────────────────────────
rds_instance_class    = "db.t3.micro"
rds_allocated_storage = 20
rds_db_name           = "cripto_exchange"
rds_username          = "dbtimo"
rds_password          = "Hemant7122"   # min 8 chars, use special chars
rds_multi_az          = false                             # set true for production HA

# ─── APP SECRETS ───────────────────────────────────────────
jwt_secret     = "8bb861cda2d9a38f00efdda346bb43934029789a395638d723bbff155c3affd8edffecbea65b82bddc1929c18e1c311eb6e1a654972117d92f6d101278f86fd6"
refresh_secret = "8f48d34f4c25841af9bb64abe1201b41c2d216df6221d66c2a4517c3d82cf05ef4de85df9b8b02375717fe2711790a7232de1a818ba2f8cb555de795ae7c51c3"

# Tron / blockchain
trongrid_api_key = "058f9b80-ddb5-4ef7-930c-8885d6b43572"
admin_wallet     = "TRRBEAZp1UhHd3W5sKHfpWjxk77WjargVg"
tron_xpub        = "your-xpub-key"
private_key      = "CBDD6F107645E7083E4E60498FB0E21C6638165D8FBAB53BCD245A5F96D00F74"
usdt_contract    = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"

# ─── EMAIL ─────────────────────────────────────────────────
email_host   = "smtp.gmail.com"
email_port   = "587"
email_user   = "noreply@timofx.com"
email_pass   = "7L8XHC9CBQB66TJK"
email_from   = "noreply@timofx.com"
email_secure = "false"
