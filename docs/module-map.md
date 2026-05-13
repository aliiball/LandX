# Module → UI Surface Map

Source: `PROMPT.md §6`. Grows phase-by-phase. Each module owns one or more pages.

| Module | Source dir / page | Status |
|---|---|---|
| K01 Plugin Lifecycle | `/admin/plugins` | Phase 5 |
| K02 DocType Engine | `/admin/doctypes` | Phase 5 |
| K03 Migration & Versioning | `/admin/migrations` | Phase 5 |
| K04 Hook & Event Bus | `/admin/hooks` | Phase 5 |
| K05 Service Container & Config | `/admin/config` | Phase 5 |
| I01 Tenant Lifecycle | `/admin/tenants` | Phase 5 |
| I02 User & Identity | `/admin/users`, `/dashboard/profile` | Phase 3, Phase 5 |
| I03 Auth & Sessions | `/login`, `/dashboard/security` | Phase 3 |
| I04 Permission Framework | `/admin/roles` | Phase 5 |
| I05 Multi-Tenant Isolation | `/admin/tenants/:id/isolation` | Phase 5 |
| A01 MCP Server Framework | `/agent/mcp` | Phase 6 |
| A02 Tool Registry | `/agent/tools` | Phase 6 |
| A03 Agent Identity & Capabilities | `/agent/agents` | Phase 6 |
| A04 Agent Memory | `/agent/memory` | Phase 6 |
| A05 Vector Store | `/agent/vectors` | Phase 6 |
| A06 Prompt Library | `/agent/prompts` | Phase 6 |
| A07 LLM Provider | `/agent/providers` | Phase 6 |
| A08 LLM Observability | `/agent/observability` | Phase 6 |
| A09 Agent Orchestration | `/agent/workflows` | Phase 6 |
| A10 Streaming/SSE | foundation — `src/lib/sse/` | Phase 3 |
| A11 Conversation & Session | `/agent/conversations`, `/dashboard/ai` | Phase 3, Phase 6 |
| S01 Auto REST API | `/admin/api` | Phase 5 |
| S02 Auto Admin UI | foundation — `src/lib/auto-admin/` | Phase 5 |
| S03 Form & Validation | foundation — RHF + zod | Phase 1 |
| S04 Workflow & State Machine | `/admin/workflows` | Phase 5 |
| S05 Notification Center | `/dashboard/notifications`, top-right popover | Phase 3 |
| S06 Search & Discovery | `/search`, `/search/ai` | Phase 2 |
| D01 Audit Log | `/admin/audit` | Phase 5 |
| D02 PII Governance | `/admin/pii` | Phase 5 |
| D03 Compliance Framework | `/admin/compliance` | Phase 5 |
| O01 Observability & SLO | `/admin/slo` | Phase 5 |
| O02 Plugin Marketplace | `/admin/marketplace`, `/marketplace` | Phase 5 |
| O03 Plugin Security Review | `/admin/security/reviews` | Phase 5 |

## R-04 Broker Module (new)
| Surface | Path | Phase |
|---|---|---|
| Ops overview | `/broker` | 3.5 |
| Portfolio | `/broker/portfolio` | 3.5 |
| Leads / CRM | `/broker/leads` | 3.5 |
| Clients | `/broker/clients` | 3.5 |
| Commissions | `/broker/commissions` | 3.5 |
| Showcase (mgmt) | `/broker/showcase` | 3.5 |
| Public showcase (SSG) | `/b/:slug` | 3.5 + 7 |
| Team | `/broker/team` | 3.5 |
| Analytics | `/broker/analytics` | 3.5 |
| AI Tools | `/broker/ai-tools` | 3.5 |
| Subscription | `/broker/subscription` | 3.5 |
