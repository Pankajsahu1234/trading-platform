# Monorepo Structure

Apna GitHub repo is structure mein set karo:

```
your-repo/
├── cripto_exchange/          ← Backend (Node.js + Prisma)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── fintech/                  ← Frontend (React + Vite)
│   ├── client/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── adminpanel/               ← Admin Panel (React + Vite)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── infra/                    ← Infrastructure as Code (YE FOLDER)
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── ecs/
│   │   │   ├── rds/
│   │   │   ├── cloudfront/
│   │   │   └── secrets/
│   │   └── envs/
│   │       └── prod/
│   │           ├── main.tf
│   │           ├── variables.tf
│   │           ├── outputs.tf
│   │           └── terraform.tfvars.example
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   └── .dockerignore
│   └── bootstrap/
│       └── init.sh
│
└── .github/
    └── workflows/
        ├── backend-deploy.yml
        ├── fintech-deploy.yml
        ├── adminpanel-deploy.yml
        └── terraform-plan.yml
```
