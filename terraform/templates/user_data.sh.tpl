#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/user-data.log | logger -t user-data) 2>&1

echo "=== Bootstrap started: $(date) | Project: ${project_name} | Region: ${aws_region} ==="

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git unzip jq build-essential ca-certificates gnupg

# ── Node.js 22 ────────────────────────────────────────────────
echo "--- Installing Node.js 22 ---"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
node --version && npm --version

# ── PM2 ───────────────────────────────────────────────────────
npm install -g pm2
pm2 --version

# ── AWS CLI v2 ────────────────────────────────────────────────
echo "--- Installing AWS CLI v2 ---"
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
unzip -q /tmp/awscliv2.zip -d /tmp/
/tmp/aws/install
rm -rf /tmp/awscliv2.zip /tmp/aws
aws --version

# ── App directories ───────────────────────────────────────────
mkdir -p /home/ubuntu/apps/cripto_exchange
mkdir -p /home/ubuntu/apps/fintech
mkdir -p /home/ubuntu/logs
chown -R ubuntu:ubuntu /home/ubuntu/apps /home/ubuntu/logs

# ── Write deployment config (Terraform vars baked in) ─────────
# These are used by all deploy scripts; source this file to get config
cat > /home/ubuntu/.deploy-config << DCONF
RELEASES_BUCKET=${releases_bucket}
AWS_REGION=${aws_region}
SECRET_NAME=${secret_name}
PROJECT=${project_name}
DCONF
chmod 600 /home/ubuntu/.deploy-config
chown ubuntu:ubuntu /home/ubuntu/.deploy-config

# ── refresh-env.sh — fetches secrets and writes .env files ────
# Run this any time secrets are rotated in Secrets Manager
cat > /usr/local/bin/refresh-env.sh << 'ENVSCRIPT'
#!/bin/bash
set -euo pipefail
source /home/ubuntu/.deploy-config

echo "Fetching secrets from: $SECRET_NAME"
SECRET_JSON=$(aws secretsmanager get-secret-value \
  --secret-id "$SECRET_NAME" \
  --region "$AWS_REGION" \
  --query SecretString \
  --output text)

if [ -z "$SECRET_JSON" ]; then
  echo "ERROR: Could not fetch secret from Secrets Manager"
  exit 1
fi

# Write cripto_exchange .env (all vars)
echo "$SECRET_JSON" | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' \
  > /home/ubuntu/apps/cripto_exchange/.env
chmod 600 /home/ubuntu/apps/cripto_exchange/.env
chown ubuntu:ubuntu /home/ubuntu/apps/cripto_exchange/.env

# Write fintech .env (minimal runtime vars)
VITE_URL=$(echo "$SECRET_JSON" | jq -r '.VITE_API_URL')
cat > /home/ubuntu/apps/fintech/.env << FENV
NODE_ENV=production
PORT=3000
FENV
chmod 600 /home/ubuntu/apps/fintech/.env
chown ubuntu:ubuntu /home/ubuntu/apps/fintech/.env

# Export VITE_API_URL for build-time use
echo "VITE_API_URL=$VITE_URL" >> /home/ubuntu/apps/fintech/.env.build
chown ubuntu:ubuntu /home/ubuntu/apps/fintech/.env.build

echo "Done. .env files refreshed."
echo "  cripto_exchange: /home/ubuntu/apps/cripto_exchange/.env"
echo "  fintech:         /home/ubuntu/apps/fintech/.env"
ENVSCRIPT
chmod +x /usr/local/bin/refresh-env.sh

# Pre-run to populate .env files (apps not yet deployed but .env ready)
/usr/local/bin/refresh-env.sh || echo "WARNING: Could not fetch secrets yet — run manually: sudo refresh-env.sh"

# ── deploy-cripto.sh ──────────────────────────────────────────
cat > /home/ubuntu/deploy-cripto.sh << 'DEPLOYC'
#!/bin/bash
set -euo pipefail
source /home/ubuntu/.deploy-config

echo ""
echo "══════════════════════════════════════════"
echo "  Deploying cripto_exchange backend"
echo "  $(date)"
echo "══════════════════════════════════════════"

# Step 1: Download latest code from S3 releases bucket
echo "[1/5] Downloading code from S3..."
aws s3 cp s3://$RELEASES_BUCKET/cripto_exchange.zip /tmp/cripto.zip --region $AWS_REGION
unzip -q -o /tmp/cripto.zip -d /tmp/cripto_src/
rm -f /tmp/cripto.zip

# Handle zip — might have a top-level folder (e.g. cripto_exchange-main/)
EXTRACTED=$(find /tmp/cripto_src -maxdepth 1 -mindepth 1 -type d | head -1)
if [ -z "$EXTRACTED" ]; then
  EXTRACTED=/tmp/cripto_src
fi
echo "  Extracted to: $EXTRACTED"
rsync -a --delete "$EXTRACTED/" /home/ubuntu/apps/cripto_exchange/
rm -rf /tmp/cripto_src
chown -R ubuntu:ubuntu /home/ubuntu/apps/cripto_exchange

# Step 2: Refresh .env from Secrets Manager
echo "[2/5] Refreshing .env..."
/usr/local/bin/refresh-env.sh

# Step 3: Install dependencies
echo "[3/5] npm install..."
cd /home/ubuntu/apps/cripto_exchange
sudo -u ubuntu npm install --omit=dev

# Step 4: Prisma
echo "[4/5] Prisma generate + migrate..."
sudo -u ubuntu npx prisma generate
sudo -u ubuntu npx prisma migrate deploy

# Step 5: Start / restart with PM2
echo "[5/5] Starting with PM2..."
sudo -u ubuntu pm2 describe cripto-backend > /dev/null 2>&1 \
  && sudo -u ubuntu pm2 restart cripto-backend \
  || sudo -u ubuntu pm2 start src/server.js \
      --name cripto-backend \
      --max-memory-restart 400M \
      --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
      --merge-logs

sudo -u ubuntu pm2 save

echo ""
echo "  Health check..."
sleep 5
curl -sf http://localhost:5000/health && echo "  ✅ cripto-backend: HEALTHY" || echo "  ❌ cripto-backend: check logs → pm2 logs cripto-backend"
echo ""
DEPLOYC
chmod +x /home/ubuntu/deploy-cripto.sh
chown ubuntu:ubuntu /home/ubuntu/deploy-cripto.sh

# ── deploy-fintech.sh ─────────────────────────────────────────
cat > /home/ubuntu/deploy-fintech.sh << 'DEPLOYF'
#!/bin/bash
set -euo pipefail
source /home/ubuntu/.deploy-config

echo ""
echo "══════════════════════════════════════════"
echo "  Deploying fintech frontend"
echo "  $(date)"
echo "══════════════════════════════════════════"

# Step 1: Download latest code from S3
echo "[1/5] Downloading code from S3..."
aws s3 cp s3://$RELEASES_BUCKET/fintech.zip /tmp/fintech.zip --region $AWS_REGION
unzip -q -o /tmp/fintech.zip -d /tmp/fintech_src/
rm -f /tmp/fintech.zip

# Handle zip — might have a top-level folder
EXTRACTED=$(find /tmp/fintech_src -maxdepth 1 -mindepth 1 -type d | head -1)
if [ -z "$EXTRACTED" ]; then
  EXTRACTED=/tmp/fintech_src
fi
rsync -a --delete "$EXTRACTED/" /home/ubuntu/apps/fintech/
rm -rf /tmp/fintech_src
chown -R ubuntu:ubuntu /home/ubuntu/apps/fintech

# Step 2: Get VITE_API_URL from Secrets Manager (needed for build)
echo "[2/5] Fetching VITE_API_URL from Secrets Manager..."
VITE_API_URL=$(aws secretsmanager get-secret-value \
  --secret-id "$SECRET_NAME" \
  --region "$AWS_REGION" \
  --query SecretString --output text | jq -r '.VITE_API_URL')

if [ -z "$VITE_API_URL" ] || [ "$VITE_API_URL" = "null" ]; then
  echo "  ERROR: VITE_API_URL not found in secrets. Check secrets.tf."
  exit 1
fi
echo "  VITE_API_URL=$VITE_API_URL"

# Step 3: Install all deps (dev deps needed for build)
echo "[3/5] npm install (with dev deps for build)..."
cd /home/ubuntu/apps/fintech
sudo -u ubuntu npm install

# Step 4: Build — VITE_API_URL baked into client bundle
echo "[4/5] Building client + server (VITE_API_URL baked in)..."
sudo -u ubuntu env VITE_API_URL="$VITE_API_URL" npm run build
# Clean up dev deps after build
sudo -u ubuntu npm prune --omit=dev

# Step 5: Start / restart with PM2
echo "[5/5] Starting with PM2..."
sudo -u ubuntu pm2 describe fintech-app > /dev/null 2>&1 \
  && sudo -u ubuntu pm2 restart fintech-app \
  || sudo -u ubuntu pm2 start dist/server/node-build.mjs \
      --name fintech-app \
      --max-memory-restart 400M \
      --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
      --merge-logs

sudo -u ubuntu pm2 save

echo ""
echo "  Health check..."
sleep 5
curl -sf http://localhost:3000/api/ping && echo "  ✅ fintech-app: HEALTHY" || echo "  ❌ fintech-app: check logs → pm2 logs fintech-app"
echo ""
DEPLOYF
chmod +x /home/ubuntu/deploy-fintech.sh
chown ubuntu:ubuntu /home/ubuntu/deploy-fintech.sh

# ── deploy-all.sh — convenience wrapper ──────────────────────
cat > /home/ubuntu/deploy-all.sh << 'DEPLOYALL'
#!/bin/bash
set -euo pipefail

echo "=== Full deployment: cripto + fintech ==="
bash /home/ubuntu/deploy-cripto.sh
bash /home/ubuntu/deploy-fintech.sh
echo "=== All deployments complete ==="

echo ""
echo "PM2 status:"
sudo -u ubuntu pm2 status
DEPLOYALL
chmod +x /home/ubuntu/deploy-all.sh
chown ubuntu:ubuntu /home/ubuntu/deploy-all.sh

# ── PM2 startup on reboot ─────────────────────────────────────
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | bash || true
systemctl enable pm2-ubuntu 2>/dev/null || true

# ── PM2 log rotation ──────────────────────────────────────────
sudo -u ubuntu pm2 install pm2-logrotate 2>/dev/null || true
sudo -u ubuntu pm2 set pm2-logrotate:max_size 50M 2>/dev/null || true
sudo -u ubuntu pm2 set pm2-logrotate:retain 7 2>/dev/null || true
sudo -u ubuntu pm2 set pm2-logrotate:compress true 2>/dev/null || true

echo ""
echo "=== Bootstrap complete: $(date) ==="
echo ""
echo "Next steps:"
echo "  1. Upload code zips:  bash scripts/upload-code.sh   (run locally)"
echo "  2. Connect to EC2:    aws ssm start-session --target <instance-id>"
echo "  3. Deploy backend:    sudo bash /home/ubuntu/deploy-cripto.sh"
echo "  4. Deploy frontend:   sudo bash /home/ubuntu/deploy-fintech.sh"
echo ""
