# CloudForge Control Plane API

NestJS Modular Monolith for the CloudForge Control Plane. This workspace owns the first HTTP boundary for identity, organizations, workspaces, projects, deployments, billing, audit, and notifications.

## Local development

```bash
npm install
npm run start:dev --workspace @cloudforge/control-plane-api
```

The health endpoint is available at `GET http://localhost:4000/v1/health`.

The API intentionally starts with a health module and provider ports. AWS, PostgreSQL, SQS, and SkipCash implementations are added behind those ports so domain modules do not depend on vendor SDKs. Do not place SkipCash credentials, AWS keys, or secret values in source control.
