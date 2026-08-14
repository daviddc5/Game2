# Objectives Alignment

## Purpose

Use **Shadows of Judgment** as the practical application for the Harness CI/CD objective. The goal is to demonstrate a dependable delivery workflow by improving a real deployed service, rather than creating a separate throwaway application.

## Current Baseline

- The game is a Vite/Phaser client with an Express and Socket.IO server.
- The multi-stage [Dockerfile](../Dockerfile) builds the client and packages it with the production server.
- The app is deployed to Google Cloud Run in `europe-west1` as `shadows-of-judgment`.
- The live service uses one `256Mi` / `1 CPU` instance and can scale to zero.
- Matchmaking and active games are held in process memory. The one-instance limit is therefore intentional; a deployment or restart ends active matches.

## Harness Objective

The practical Harness work should use this application to prove the following workflow:

```text
Feature branch -> pull request -> Harness CI -> test gate -> container image
-> Artifact Registry (commit SHA tag) -> Cloud Run test -> approval
-> Cloud Run production -> smoke check -> rollback when needed
```

Harness needs credentials that can build and deploy to the existing GCP project. Prefer a dedicated least-privilege service account stored as a Harness secret. Do not use personal credentials in the pipeline.

## Track P Scope

The original Azure foundation sessions are replaced by an **existing deployment audit**, not marked complete:

- Hosting platform and region: Cloud Run, `europe-west1`.
- Build and runtime contract: [Dockerfile](../Dockerfile) and [server/index.js](../server/index.js).
- Deployment command, public URL, logs, access control, budget alert, and rollback procedure.
- Record the current source-based deploy as the baseline and its risks.

Keep the documentation and branch-flow sessions, then work through the Harness sequence:

| Sessions | Evidence from this app |
| --- | --- |
| P6-P9 | Current-state inventory, actual branch flow, target branch strategy, migration risks |
| P10-P16 | Harness connector and CI pipeline that builds, tests, and pushes an immutable image |
| P17-P23 | Test and production Cloud Run targets, approval, rollback, and a timed deliberate failure |
| P24-P28 | Feature flag for a safe game behavior, with a separately tested kill switch |
| P29-P32 | Recorded end-to-end demo, runbook, and deployment/rollback metrics |

The Oomph database-copy sessions, P33-P41, remain separate from this game. They require approved access, a PII decision, and a non-production source copy.

## Guardrails

- Keep `max-instances=1` until shared multiplayer state is moved out of memory.
- Treat Cloud Run revision rollback as recovery for a bad release; it disconnects active matches.
- Use a separate Cloud Run test service or project before automated production deployments.
- Restrict production Socket.IO CORS to the approved client origin instead of the current wildcard fallback.
- Tag every deployable image with the commit SHA; do not deploy an unversioned `latest` image.
- Protect the production branch and require the CI check before merge.

## Next Sessions

1. Complete the existing deployment audit and update [DEPLOYMENT.md](DEPLOYMENT.md) so the documented region is `europe-west1`.
2. Inventory the current build, deploy, rollback, log, and metric steps for P6.
3. Document the actual branch flow for P7, then choose the protected-branch strategy for P8.
4. Read the paired Harness material before beginning P10.

## Related Documentation

- [Deployment guide](DEPLOYMENT.md)
- [Game design document](GDD.md)
- [Learning guide](LEARNING_GUIDE.md)
- [Design notes](design-notes/)