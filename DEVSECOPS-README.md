# DevSecOps Setup Guide

## Kya implement kiya gaya hai

### 1. Secrets Scanning — Gitleaks
**File:** `.github/workflows/security-scan.yml`
**Kab chalta hai:** Har push aur PR pe
**Kya karta hai:** Git history mein hardcoded secrets dhundta hai
(API keys, passwords, JWT secrets, database URLs)

**Setup:**
- `.gitleaks.toml` repo root mein copy karo
- Automatically kaam karta hai — koi extra setup nahi

---

### 2. npm audit + Dependabot
**File:** `.github/workflows/security-scan.yml` + `.github/dependabot.yml`
**Kab chalta hai:** 
- `npm audit` — har push/PR pe
- Dependabot — har Monday

**Kya karta hai:**
- `npm audit` — HIGH/CRITICAL vulnerabilities report karta hai
- Dependabot — vulnerable packages ke liye auto PR banata hai

**Setup:**
- `.github/dependabot.yml` repo mein copy karo
- Automatically enable ho jaata hai

---

### 3. Terraform Security — tfsec + Checkov
**File:** `.github/workflows/security-scan.yml`
**Kab chalta hai:** Har push/PR pe
**Kya karta hai:**
- `tfsec` — Terraform misconfigurations dhundta hai
- `checkov` — CIS benchmark checks karta hai

---

### 4. Docker Image Security — Trivy
**File:** `.github/workflows/security-scan.yml`
**Kab chalta hai:** Har push/PR pe
**Kya karta hai:** Docker image mein HIGH/CRITICAL CVEs dhundta hai
Results GitHub Security tab mein dikhte hain

---

### 5. AWS GuardDuty + CloudTrail
**File:** `security.tf`
**Kya karta hai:**
- GuardDuty — Runtime threat detection (brute force, crypto mining, etc.)
- CloudTrail — Saare AWS API calls audit log
- Email alert — HIGH/CRITICAL GuardDuty findings pe

**Setup:**
1. `security.tf` ko `devops/infra/terraform/envs/prod/` mein copy karo
2. `variables.tf` mein add karo:
   ```hcl
   variable "security_alert_email" {
     type    = string
     default = "admin@timofx.com"
   }
   ```
3. `terraform apply` run karo
4. SNS subscription confirm karo (email aayega)

---

## Files to copy in your repo

```
repo/
├── .github/
│   ├── workflows/
│   │   └── security-scan.yml    ← Security scanning pipeline
│   └── dependabot.yml           ← Auto dependency updates
├── .gitleaks.toml               ← Secrets scanning config
└── devops/infra/terraform/envs/prod/
    └── security.tf              ← GuardDuty + CloudTrail
```

---

## Security Dashboard

GitHub → Security tab mein ye sab dikhega:
- Secret scanning alerts
- Dependabot alerts
- Code scanning (Trivy SARIF)

---

## Costs

| Service | Cost |
|---|---|
| GuardDuty | ~$1-3/month (small traffic) |
| CloudTrail | First trail free, S3 storage minimal |
| GitHub Actions | Free tier mein included |
| Gitleaks/Trivy/tfsec | Free (open source) |
| Dependabot | Free |
