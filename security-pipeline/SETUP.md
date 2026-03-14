# Security Pipeline Setup

## Files to copy in your TIMO repo

```
.github/
├── workflows/
│   └── security-pipeline.yml   ← Main security workflow
├── zap-rules.tsv               ← ZAP false positive rules
├── owasp-suppressions.xml      ← OWASP false positive suppressions
└── dependabot.yml              ← Auto dependency updates

.gitleaks.toml                  ← Secrets scanning config

cripto_exchange-main/
└── sonar-project.properties    ← SonarQube backend config
    (rename from cripto_exchange-main-sonar-project.properties)
```

---

## GitHub Secrets Required

GitHub → Settings → Secrets → New repository secret:

| Secret | Value | Required for |
|---|---|---|
| `SONAR_TOKEN` | SonarQube auth token | SonarQube |
| `SONAR_HOST_URL` | SonarQube server URL | SonarQube |

### SonarQube Setup (Free Cloud):
1. sonarcloud.io par signup karo (GitHub se)
2. New Project → Import from GitHub → TIMO repo select karo
3. Project key milega → `SONAR_TOKEN` generate karo
4. `SONAR_HOST_URL` = `https://sonarcloud.io`

---

## How it works

### Trigger:
- Har `main` pe push → Security scan chalega
- Har PR → Security scan chalega  
- Har Monday 2AM → Weekly full scan

### Reports download karna:
1. GitHub → Actions → Security Pipeline run
2. Scroll down → Artifacts section
3. **🔒-FULL-SECURITY-REPORT** download karo
4. ZIP extract karo → `index.html` browser mein open karo
5. Sabhi reports ek jagah milenge!

---

## Tool Details

### Trivy
- Docker image CVEs
- npm package vulnerabilities
- CRITICAL + HIGH + MEDIUM

### OWASP Dependency Check
- NVD database se CVE check
- Saare npm dependencies
- HTML report with CVSS scores

### OWASP ZAP
- Live API security testing
- OWASP Top 10 checks
- SQL Injection, XSS, CSRF, etc.

### SonarQube
- Code quality metrics
- Security hotspots
- Bugs aur code smells
- Technical debt

### Gitleaks
- Git history mein secrets
- API keys, passwords, tokens
- HTML report
