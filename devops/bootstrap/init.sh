#!/bin/bash
# Run this ONCE before terraform init
# Creates S3 bucket for tfstate + DynamoDB table for locking

set -e

AWS_REGION="ap-south-1"
BUCKET_NAME="timo-tfstat3-prod-bucke3t"
TABLE_NAME="timo-tfstat3-prod-lock"

echo "==> Creating S3 bucket for Terraform state..."
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$AWS_REGION" \
  --create-bucket-configuration LocationConstraint="$AWS_REGION"

aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
  }'

aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "==> Creating DynamoDB table for state locking..."
aws dynamodb create-table \
  --table-name "$TABLE_NAME" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$AWS_REGION"

echo ""
echo "✅ Bootstrap complete!"
echo "   S3 bucket : $BUCKET_NAME"
echo "   DynamoDB  : $TABLE_NAME"
echo ""
echo "Now run:"
echo "  cd terraform/envs/prod"
echo "  cp terraform.tfvars.example terraform.tfvars"
echo "  # Fill in terraform.tfvars"
echo "  terraform init"
echo "  terraform plan"
echo "  terraform apply"
