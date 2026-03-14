# Production Deployment — Step by Step

## Prerequisites Check
- [ ] AWS CLI installed: `aws --version`
- [ ] Terraform installed: `terraform --version` (need 1.5+)
- [ ] Docker installed: `docker --version`
- [ ] AWS CLI configured: `aws configure` (Access Key + Secret)

---

## STEP 1 — GitHub Monorepo Setup

Ek naya GitHub repo banao aur projects is structure mein push karo:

```
your-repo/
├── cripto_exchange/    ← backend ke files yahan
├── fintech/            ← frontend ke files yahan
├── adminpanel/         ← admin ke files yahan
├── infra/              ← ye infra folder yahan
└── .github/workflows/  ← workflows yahan
```

Workflows file rename karo (.github/workflows/ mein jaayein):
- github-actions/backend-deploy.yml     → .github/workflows/backend-deploy.yml
- github-actions/fintech-deploy.yml     → .github/workflows/fintech-deploy.yml
- github-actions/adminpanel-deploy.yml  → .github/workflows/adminpanel-deploy.yml
- github-actions/terraform-plan.yml     → .github/workflows/terraform-plan.yml

---

## STEP 2 — Terraform State Bootstrap (SIRF ONCE)

```bash
cd infra/bootstrap
chmod +x init.sh
./init.sh
```

Ye S3 bucket aur DynamoDB table banayega Terraform state ke liye.

---

## STEP 3 — Terraform Variables Set Karo

```bash
cd infra/terraform/envs/prod
cp terraform.tfvars.example terraform.tfvars
```

terraform.tfvars mein fill karo:
- db_password  → strong password (min 12 chars, numbers + symbols)
- jwt_secret   → random 32+ char string (openssl rand -hex 32)
- email_user   → aapka Gmail
- email_pass   → Gmail App Password (not regular password!)
- email_from   → same as email_user

⚠️  terraform.tfvars kabhi bhi git mein commit mat karna!
    .gitignore mein add karo: echo "terraform.tfvars" >> .gitignore

---

## STEP 4 — Terraform Init + Apply

```bash
cd infra/terraform/envs/prod

terraform init
terraform validate
terraform plan      # Review karo kya banayega
terraform apply     # Confirm karo — "yes" type karo
```

⏱️  15-20 minutes lagenge (RDS sabse zyada time leta hai)

Apply ke baad outputs save karo:
```bash
terraform output > ../../../terraform-outputs.txt
cat terraform-outputs.txt
```

---

## STEP 5 — GitHub Secrets Set Karo

GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Ye secrets add karo:

| Secret Name                  | Value                                        |
|------------------------------|----------------------------------------------|
| AWS_ACCESS_KEY_ID            | IAM user ka access key                       |
| AWS_SECRET_ACCESS_KEY        | IAM user ka secret key                       |
| TF_DB_PASSWORD               | Same as terraform.tfvars db_password         |
| TF_JWT_SECRET                | Same as terraform.tfvars jwt_secret          |
| TF_EMAIL_USER                | Email address                                |
| TF_EMAIL_PASS                | Gmail App Password                           |
| TF_EMAIL_FROM                | Email from address                           |
| VITE_API_URL                 | http://<alb_dns_name>/api  (terraform output)|
| FINTECH_CF_DISTRIBUTION_ID   | terraform output fintech_cf_distribution_id  |
| ADMIN_CF_DISTRIBUTION_ID     | terraform output admin_cf_distribution_id    |

IAM User banane ke liye:
1. AWS Console → IAM → Users → Create User
2. Name: "github-actions-cripto"
3. Attach policy: IAM-policy-for-github-actions.json (infra folder mein hai)
4. Access Keys tab → Create access key → "Application running outside AWS"
5. Key copy karo → GitHub secrets mein paste karo

---

## STEP 6 — Pehla Manual Deploy (First Image Push)

Backend ka pehla Docker image manually push karna hoga (chicken-and-egg problem):

```bash
# ECR URL lo (terraform output se)
ECR_URL=$(terraform -chdir=infra/terraform/envs/prod output -raw ecr_repository_url)
AWS_REGION="ap-south-1"

# ECR login
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_URL

# Build aur push
cd cripto_exchange
docker build -f ../infra/docker/Dockerfile.backend -t $ECR_URL:latest .
docker push $ECR_URL:latest

# ECS service update karo
aws ecs update-service \
  --cluster cripto-prod-cluster \
  --service cripto-prod-backend \
  --force-new-deployment \
  --region $AWS_REGION
```

---

## STEP 7 — Database Migration

ECS task run hone ke baad Prisma migrate karo:

```bash
# Option A: ECS Exec (recommended)
aws ecs execute-command \
  --cluster cripto-prod-cluster \
  --task $(aws ecs list-tasks --cluster cripto-prod-cluster --query 'taskArns[0]' --output text) \
  --container backend \
  --interactive \
  --command "npx prisma migrate deploy"

# Option B: Local se (DATABASE_URL set karke)
# DATABASE_URL="mysql://..." npx prisma migrate deploy
# DATABASE_URL="mysql://..." node prisma/seed.js
```

---

## STEP 8 — Frontend + Admin Deploy

Pehli baar manually trigger karo:

GitHub → Actions → "Frontend Deploy" → Run workflow → main
GitHub → Actions → "Admin Panel Deploy" → Run workflow → main

---

## STEP 9 — Verify Karo

```bash
# Backend health check
curl http://<alb_dns_name>/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

Frontend: https://<fintech_cloudfront_domain>
Admin:    https://<admin_cloudfront_domain>

---

## Ab Se — Auto Deploy

Koi bhi developer main par push kare:
- cripto_exchange mein change → Backend automatically deploy hoga
- fintech mein change → Frontend automatically deploy hoga
- adminpanel mein change → Admin automatically deploy hoga

PR banane par → Terraform plan automatically PR comment mein dikhega

---

## Domain Configure Karna (Baad Mein)

Jab domain ready ho:
1. AWS Certificate Manager → Request certificate (ap-south-1)
2. CloudFront distribution mein domain + certificate add karo
3. ALB mein HTTPS listener add karo
4. Route53 ya DNS provider mein records set karo
5. terraform.tfvars update karo + terraform apply

---

## Useful Commands

```bash
# ECS service status
aws ecs describe-services \
  --cluster cripto-prod-cluster \
  --services cripto-prod-backend \
  --region ap-south-1

# Live logs
aws logs tail /ecs/cripto-prod-backend --follow --region ap-south-1

# Force new deployment (manual)
aws ecs update-service \
  --cluster cripto-prod-cluster \
  --service cripto-prod-backend \
  --force-new-deployment \
  --region ap-south-1

# Terraform refresh outputs
terraform -chdir=infra/terraform/envs/prod output
```
