# Copy this file to terraform.tfvars and fill in values
# NEVER commit terraform.tfvars to git

aws_region  = "ap-south-1"
project     = "timo"
environment = "prod2"

db_username = "timodb2"
db_password = "fxtimo850209"
db_name     = "timofxdb2"

jwt_secret  = "8bb861cda2d9a38f00efdda346bb43934029789a395638d723bbff155c3affd8edffecbea65b82bddc1929c18e1c311eb6e1a654972117d92f6d101278f86fd6"


email_host  = "smtp.protonmail.com"
email_port  = "587"
email_user  = "noreply@timofx.com"
email_pass  = "7L8XHC9CBQB66TJK"
email_from  = "noreply@timofx.com"

security_alert_email = "timofxtrading@proton.me"