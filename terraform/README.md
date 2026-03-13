# Production AWS Infrastructure — Terraform

## Architecture

```
Internet
    │
    ▼
[CloudFront]──────[S3: adminpanel]   (Admin Panel SPA)
    
[ALB: public]
    ├── /api/*  ──► [EC2: port 5000]  (cripto_exchange backend)
    └── /*      ──► [EC2: port 3000]  (fintech full-stack app)
         │
    [Private Subnet]
         │
    [RDS MySQL 8.0: private]
    
[S3: deposits]     (deposit screenshots, private)
[S3: releases]     (cripto_exchange.zip, fintech.zip)
[Secrets Manager]  (all env vars, auto-injected)
```

**Security:**
- EC2 has NO public IP — access only via SSM Session Manager (no SSH keys)
- RDS is in private subnet — unreachable from internet
- All traffic: Internet → ALB → EC2 (via private subnet + NAT)
- S3 adminpanel: accessible only via CloudFront OAC
- All EBS/RDS volumes encrypted at rest

---

## Prerequisites

1. **Terraform >= 1.5** — [install](https://developer.hashicorp.com/terraform/downloads)
2. **AWS CLI v2** — [install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. **AWS credentials configured:**
   ```bash
   aws configure
   # or
   export AWS_ACCESS_KEY_ID=...
   export AWS_SECRET_ACCESS_KEY=...
   ```
4. **IAM permissions needed:**
   - EC2, RDS, VPC, S3, CloudFront, ALB, IAM, Secrets Manager, ACM, SSM, CloudWatch

---

## Step 1 — Configure

```bash
cd terraform/
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and fill in all values. Required:
- `rds_password` — strong password (min 8 chars, use special characters)
- `jwt_secret` / `refresh_secret` — 64+ random chars each
- `trongrid_api_key`, `admin_wallet`, `tron_xpub`, `private_key`
- `email_host`, `email_user`, `email_pass`, `email_from`

---

## Step 2 — Deploy Infrastructure

```bash
cd terraform/
terraform init
terraform plan    # review what will be created (~65 resources)
terraform apply   # takes ~15-20 minutes (RDS creation is slow)
```

After apply, note the outputs:
```bash
terraform output   # shows ALB URL, EC2 ID, bucket names, etc.
```

---

## Step 3 — Upload Code to S3

Run this **locally** from the directory containing your project folders:

```bash
# From the directory containing cripto_exchange-main/ and fintech-main/:
bash terraform/scripts/upload-code.sh
```

This script:
- Zips cripto_exchange (excluding node_modules, .env)
- Zips fintech (excluding node_modules, dist, .env)
- Uploads both to the S3 releases bucket

If your project folders are in a different location:
```bash
CRIPTO_DIR=/path/to/cripto_exchange-main \
FINTECH_DIR=/path/to/fintech-main \
bash terraform/scripts/upload-code.sh
```

---

## Step 4 — Connect to EC2 via SSM

```bash
# Get the command from Terraform output:
terraform output ssm_connect_command

# Or directly:
aws ssm start-session --target $(terraform output -raw ec2_instance_id) --region ap-south-1
```

No SSH key required. Connects via AWS Systems Manager.

---

## Step 5 — Deploy Backend (on EC2)

```bash
# Inside SSM session:
sudo bash /home/ubuntu/deploy-cripto.sh
```

This script automatically:
1. Downloads `cripto_exchange.zip` from S3
2. Extracts and copies code
3. Fetches secrets from Secrets Manager → writes `.env`
4. `npm install --omit=dev`
5. `npx prisma generate && npx prisma migrate deploy`
6. Starts via PM2

---

## Step 6 — Deploy Fintech Frontend (on EC2)

```bash
# Inside SSM session:
sudo bash /home/ubuntu/deploy-fintech.sh
```

This script automatically:
1. Downloads `fintech.zip` from S3
2. Fetches `VITE_API_URL` from Secrets Manager
3. `npm install` (with dev deps for build)
4. `npm run build` with `VITE_API_URL` baked into the client bundle
5. `npm prune --omit=dev`
6. Starts via PM2

---

## Step 7 — Deploy Admin Panel (locally)

```bash
# Get the API URL:
terraform output vite_api_url_for_frontends

# Build locally:
cd adminpanel-main
VITE_API_URL="http://<alb-dns-name>/api" npm run build

# Upload to S3:
aws s3 sync ./dist s3://$(cd terraform && terraform output -raw s3_adminpanel_bucket) \
  --delete --region ap-south-1

# Invalidate CloudFront cache:
aws cloudfront create-invalidation \
  --distribution-id $(cd terraform && terraform output -raw cloudfront_distribution_id) \
  --paths '/*'
```

---

## Redeployment (after code changes)

```bash
# Upload new code:
bash terraform/scripts/upload-code.sh

# Redeploy on EC2 (via SSM):
sudo bash /home/ubuntu/deploy-all.sh       # both apps at once
# or individually:
sudo bash /home/ubuntu/deploy-cripto.sh
sudo bash /home/ubuntu/deploy-fintech.sh
```

---

## Useful Commands

```bash
# View PM2 process status
pm2 status

# View logs
pm2 logs cripto-backend --lines 100
pm2 logs fintech-app --lines 100

# Refresh .env from Secrets Manager (after rotating secrets)
sudo refresh-env.sh
pm2 restart cripto-backend

# Check health
curl http://localhost:5000/health
curl http://localhost:3000/api/ping
```

---

## Domain + HTTPS Setup

1. Set `domain_name` in `terraform.tfvars`
2. If using Route53: also set `route53_zone_id` → SSL auto-validated
3. If using another DNS provider:
   - Run `terraform apply`
   - Get CNAME records: `terraform output acm_validation_records_alb`
   - Add them to your DNS provider
   - Wait for cert validation (~5 min)
   - Add ALB DNS as CNAME/A record for your domain

---

## Enable Remote State (Recommended)

After first apply, create an S3 bucket for state and uncomment in `main.tf`:

```hcl
backend "s3" {
  bucket         = "your-project-tfstate"
  key            = "production/terraform.tfstate"
  region         = "ap-south-1"
  encrypt        = true
  dynamodb_table = "your-project-tfstate-lock"
}
```

---

## Cost Estimate (ap-south-1, monthly)

| Resource | Config | ~Cost |
|---|---|---|
| EC2 t3.medium | 1 instance | ~$30 |
| RDS db.t3.micro | MySQL 8.0, 20GB | ~$15 |
| ALB | per hour + LCU | ~$20 |
| NAT Gateway | per hour + data | ~$35 |
| CloudFront | 1TB transfer | ~$8 |
| S3 | ~50GB | ~$2 |
| **Total** | | **~$110/mo** |

Biggest cost: NAT Gateway. For cost savings, you can switch EC2 to a public subnet and remove NAT GW — but this is less secure.
