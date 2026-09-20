# CloudForge Master Blueprint

**Status:** Approved MVP baseline  
**Version:** 1.1  
**Primary language:** English  
**Infrastructure:** AWS-first  
**Billing provider:** SkipCash through an internal billing adapter  
**Build contract:** Customer projects must provide a `Dockerfile` in the first release

## 1. Executive decision

CloudForge is an AWS-first cloud application platform for connecting source repositories, building container images, deploying preview and production environments, and operating the resulting workloads. The approved MVP keeps the product deliberately narrow: one cloud provider, ECS Fargate for runtime workloads, managed PostgreSQL, S3 for artifacts, SQS for asynchronous work, and Route 53 plus CloudFront/ACM/WAF for edge delivery. Kubernetes, multi-region orchestration, public serverless functions, and a broad autonomous AI control plane remain post-MVP items.

The platform is split into two security boundaries. The **Control Plane** owns identity, organizations, workspaces, projects, environments, deployments, domains, secrets metadata, usage, billing, audit, and commands. The **Data Plane** runs customer services, customer databases, networking, logs, and runtime resources. The Control Plane never grants the browser direct access to ECS or customer workloads; state-changing operations pass through an idempotent command path and a worker adapter.

## 2. Approved changes to the baseline

| Decision | MVP implementation | Explicit boundary |
| --- | --- | --- |
| Billing | `SkipCashBillingAdapter` behind a provider-neutral `BillingPort` | No SkipCash SDK or API types may leak into domain modules |
| Dashboard UX | Mobile-first responsive layout with keyboard-safe forms, fluid tables, compact navigation, and desktop expansion | All Control Plane screens must work at 375 px, 768 px, 1440 px, and ultra-wide widths |
| Customer builds | Dockerfile-only build contract, validated before a deployment command is accepted | Buildpacks are deferred until a later release |
| Runtime | ECS Fargate behind an Application Load Balancer | EKS and multi-cluster scheduling are deferred |
| Async work | SQS Standard for idempotent build/deploy work and SQS FIFO where ordering or deduplication is required | Kafka/MSK is deferred |
| Infrastructure | Terraform modules with least-privilege IAM and isolated private subnets | Production state backend and account-level guardrails are configured per environment |

## 3. Monorepo target structure

```text
cloudforge/
├── apps/
│   └── control-plane-api/       # NestJS Modular Monolith
├── packages/
│   ├── contracts/               # Shared DTOs, command and event contracts
│   └── adapters/                # Provider ports and implementations
├── infra/
│   └── terraform/               # AWS network, IAM, SQS foundation
├── docs/
│   └── MASTER_BLUEPRINT.md
└── src/                         # Existing CloudForge web application
```

The web application remains at the repository root during the migration. New platform services use workspace boundaries so the UI can later consume versioned contracts without coupling itself to AWS SDK calls.

## 4. Control Plane API

The first API is a NestJS Modular Monolith, not a distributed collection of services. The initial modules are Identity and Organizations, Workspaces and Projects, Deployments and Releases, Environments and Domains, Secrets Metadata, Databases and Add-ons, Usage and Billing, Audit, and Notifications. Each state-changing command carries an idempotency key and produces an audit record.

The API exposes health and readiness endpoints first, followed by authenticated resource modules. Deployment requests create a `queued` deployment record and publish a message containing `deployment_id`. A worker transitions the deployment through `building`, `provisioning`, `ready`, or `failed`, using bounded retries, backoff, deadlines, and a dead-letter queue. The worker records the image digest in ECR, updates ECS, waits for a health check, and emits usage events.

### Initial data model

The Control Plane database uses managed PostgreSQL. The first migration set covers `users`, `organizations`, `memberships`, `projects`, `environments`, `services`, `deployments`, `deployment_events`, `domains`, `secret_metadata`, `resource_usage`, `billing_accounts`, and `audit_logs`. Secret values are never stored in PostgreSQL; only a Secrets Manager reference, metadata, rotation status, and ownership identifiers are stored.

Every tenant-owned record carries `organization_id`. Authorization is enforced in the service layer and in worker handlers. PostgreSQL Row-Level Security is an additional defense, not the sole authorization mechanism.

## 5. Dockerfile-only build contract

A deployment is accepted only when the selected repository revision contains a readable `Dockerfile` at the configured build context. The API validates the contract and reports a user-facing error before queueing work. The worker delegates image building to the selected build adapter, scans the resulting image, records the immutable ECR digest, and deploys that digest rather than a mutable tag.

The adapter boundary is intentionally provider-neutral:

```text
ComputePort:  createService, updateService, scaleService, deleteService, getHealth
DatabasePort: provision, rotateCredentials, snapshot, restore
ArtifactPort: upload, getDigest, delete
DomainPort:   createRecord, issueCertificate, removeRecord
BillingPort:  createCheckout, getSubscription, cancelSubscription, handleWebhook
```

## 6. SkipCash billing architecture

Billing modules depend on `BillingPort`, not on SkipCash-specific objects. The `SkipCashBillingAdapter` maps CloudForge plans, checkout sessions, subscriptions, invoices, and webhook events to the internal billing model. Webhook processing is signature-verified, idempotent, and persisted as an audit event before entitlement changes are applied. API credentials are loaded from AWS Secrets Manager and injected at runtime; they are never committed to the repository or returned to the browser.

The initial plans are Free, Pro, Enterprise, and Ad Engine. Monthly and annual billing are represented as provider-neutral price references so a provider change does not require a schema rewrite.

## 7. AWS foundation

Terraform provisions an AWS VPC with public subnets reserved for future edge-facing components and isolated private subnets for the Control Plane, workers, and data services. The initial network foundation does not expose databases or queues to the public internet. SQS Standard and FIFO queues each have a dead-letter queue, bounded retention, and encryption enabled. IAM policies are scoped to the queue ARNs required by the worker role.

The next infrastructure layers will add ECS cluster/services, ALB, ECR, RDS/Aurora, Secrets Manager, KMS, CloudWatch, Route 53, ACM, CloudFront, and WAF. Those layers are intentionally separate from the foundation so each environment can be reviewed and applied independently.

## 8. Responsive dashboard standard

The dashboard is mobile-first. At narrow widths, navigation collapses into a drawer, tables become stacked records or horizontal-scrolling data regions with preserved labels, and primary actions remain reachable without overlap. At tablet widths, two-column work areas are allowed when content remains readable. Desktop and ultra-wide layouts use a constrained content rail with predictable gutters rather than stretching every control to the viewport edge.

The acceptance baseline is zero horizontal page overflow, no brand-name word breaking, no fixed-width modal that exceeds the viewport, and no floating support control over a primary action. English is the default product language and the document direction is LTR unless a user explicitly selects another supported language.

## 9. Security and operational controls

The MVP uses GitHub OIDC rather than long-lived AWS access keys for CI/CD. Secrets use AWS Secrets Manager with KMS encryption and rotation metadata. ECS task roles, worker roles, and deployment roles are separate. CloudWatch and OpenTelemetry provide logs, metrics, traces, and deployment notifications. Every privileged mutation is attributable to an actor, organization, request ID, idempotency key, and timestamp.

Data export and deletion are explicit product operations. Backups, point-in-time recovery, retention, and environment isolation are configured per deployment tier. Production Terraform state must use a remote encrypted backend with locking before the first production apply.

## 10. Delivery sequence

1. Establish the repository workspace boundaries, shared contracts, and Control Plane health endpoint.
2. Add PostgreSQL migrations and authenticated organization/project APIs.
3. Add Dockerfile validation, deployment commands, SQS consumers, and the ECS compute adapter.
4. Add SkipCash checkout, subscription, invoice, and verified webhook flows.
5. Add ECS, ECR, RDS/Aurora, Secrets Manager, observability, DNS, TLS, and WAF Terraform modules.
6. Connect the CloudForge dashboard using versioned contracts and complete the responsive acceptance matrix.

## 11. Deferred scope

Kubernetes, multi-region scheduling, SAML/SCIM, PrivateLink, GPU workloads, a public plugin marketplace, broad autonomous code modification, and Kafka/MSK are deferred until the MVP demonstrates product-market fit and operational demand.

> This document is the single architectural reference for the approved CloudForge MVP. Any implementation that contradicts the boundaries above requires an explicit architecture review.

## References

[1]: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html "Amazon VPC User Guide"
[2]: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html "Amazon ECS AWS Fargate"
[3]: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html "Amazon SQS FIFO Queues"
[4]: https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html "AWS Identity and Access Management"
[5]: https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html "AWS Secrets Manager"

