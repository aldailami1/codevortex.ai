# CloudForge AWS foundation

This Terraform root provisions the approved MVP foundation: an AWS VPC with public and isolated subnets, least-privilege ECS task roles, and encrypted SQS Standard/FIFO queues with dead-letter queues.

## Validate

```bash
terraform init -backend=false
terraform fmt -check -recursive
terraform validate
terraform plan -var='environment=dev'
```

The module intentionally does not create public database access, NAT routes, ECS services, or SkipCash secrets. Add those layers only after the account-level state backend, KMS policy, environment approvals, and networking review are in place. Production state must use an encrypted remote backend with locking.

Never commit `terraform.tfvars`, provider credentials, state files, or SkipCash secrets.
