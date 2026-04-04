@echo off
cd /d timofx/cripto_exchange-main
npx prisma generate
npx prisma db push
pause
