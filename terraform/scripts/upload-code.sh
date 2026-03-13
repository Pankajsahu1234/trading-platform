#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# upload-code.sh — Run this LOCALLY to upload your app code to S3 releases bucket
#
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - Terraform applied (to get releases bucket name)
#   - Run from the root directory that contains cripto_exchange and fintech folders
#
# Usage:
#   cd /path/to/projects
#   bash terraform/scripts/upload-code.sh
#
# Or with explicit paths:
#   CRIPTO_DIR=./cripto_exchange-main FINTECH_DIR=./fintech-main bash upload-code.sh
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

# ── Config ────────────────────────────────────────────────────
TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AWS_REGION="${AWS_REGION:-ap-south-1}"

# Detect releases bucket from Terraform output
echo "==> Fetching releases bucket name from Terraform output..."
cd "$TERRAFORM_DIR"
RELEASES_BUCKET=$(terraform output -raw s3_releases_bucket 2>/dev/null || echo "")

if [ -z "$RELEASES_BUCKET" ]; then
  echo ""
  echo "ERROR: Could not get releases bucket from Terraform output."
  echo "Make sure you have run 'terraform apply' first."
  echo ""
  echo "Or set manually:"
  echo "  export RELEASES_BUCKET=your-bucket-name"
  echo "  bash scripts/upload-code.sh"
  exit 1
fi

echo "  Releases bucket: $RELEASES_BUCKET"
echo "  Region:          $AWS_REGION"

# ── Project dirs ──────────────────────────────────────────────
# Look for project directories relative to where terraform dir lives
# Adjust these paths to match your local structure
PROJECT_ROOT="${PROJECT_ROOT:-$(dirname "$TERRAFORM_DIR")}"
CRIPTO_DIR="${CRIPTO_DIR:-$PROJECT_ROOT/cripto_exchange-main}"
FINTECH_DIR="${FINTECH_DIR:-$PROJECT_ROOT/fintech-main}"

if [ ! -d "$CRIPTO_DIR" ]; then
  echo ""
  echo "ERROR: cripto_exchange directory not found at: $CRIPTO_DIR"
  echo "Set CRIPTO_DIR env var to the correct path:"
  echo "  CRIPTO_DIR=/path/to/cripto_exchange bash scripts/upload-code.sh"
  exit 1
fi

if [ ! -d "$FINTECH_DIR" ]; then
  echo ""
  echo "ERROR: fintech directory not found at: $FINTECH_DIR"
  echo "Set FINTECH_DIR env var to the correct path:"
  echo "  FINTECH_DIR=/path/to/fintech bash scripts/upload-code.sh"
  exit 1
fi

echo ""
echo "==> Zipping cripto_exchange from: $CRIPTO_DIR"
cd "$CRIPTO_DIR/.."
CRIPTO_NAME=$(basename "$CRIPTO_DIR")
zip -r /tmp/cripto_exchange.zip "$CRIPTO_NAME" \
  --exclude "$CRIPTO_NAME/node_modules/*" \
  --exclude "$CRIPTO_NAME/.git/*" \
  --exclude "$CRIPTO_NAME/*.log" \
  --exclude "$CRIPTO_NAME/.env"
echo "  Size: $(du -sh /tmp/cripto_exchange.zip | cut -f1)"

echo ""
echo "==> Zipping fintech from: $FINTECH_DIR"
cd "$FINTECH_DIR/.."
FINTECH_NAME=$(basename "$FINTECH_DIR")
zip -r /tmp/fintech.zip "$FINTECH_NAME" \
  --exclude "$FINTECH_NAME/node_modules/*" \
  --exclude "$FINTECH_NAME/.git/*" \
  --exclude "$FINTECH_NAME/dist/*" \
  --exclude "$FINTECH_NAME/*.log" \
  --exclude "$FINTECH_NAME/.env"
echo "  Size: $(du -sh /tmp/fintech.zip | cut -f1)"

echo ""
echo "==> Uploading to S3..."
aws s3 cp /tmp/cripto_exchange.zip "s3://$RELEASES_BUCKET/cripto_exchange.zip" \
  --region "$AWS_REGION" \
  --sse AES256
echo "  ✅ cripto_exchange.zip → s3://$RELEASES_BUCKET/cripto_exchange.zip"

aws s3 cp /tmp/fintech.zip "s3://$RELEASES_BUCKET/fintech.zip" \
  --region "$AWS_REGION" \
  --sse AES256
echo "  ✅ fintech.zip         → s3://$RELEASES_BUCKET/fintech.zip"

# Cleanup
rm -f /tmp/cripto_exchange.zip /tmp/fintech.zip

echo ""
echo "════════════════════════════════════════════"
echo "  Upload complete!"
echo ""
echo "  Now connect to EC2 and deploy:"
echo "  aws ssm start-session --target \$(terraform output -raw ec2_instance_id) --region $AWS_REGION"
echo ""
echo "  On EC2:"
echo "    sudo bash /home/ubuntu/deploy-cripto.sh"
echo "    sudo bash /home/ubuntu/deploy-fintech.sh"
echo "════════════════════════════════════════════"
