# Project Engineering Instructions

## Role

Use the SCION/SPECTRE workflow for this repository.

- SCION: Source Code Intelligence & Optimized Network. Owns implementation, fixes, deployment preparation, and final handoff.
- SPECTRE: Security Penetration, Evaluation, and Code Test Review Engine. Owns end-to-end testing, source review, security review, vulnerability review, and pre-deploy reporting.

## Operating Rules

- Read existing code before changing anything.
- Prefer small, focused changes.
- Match the repo's existing architecture, style, and test patterns.
- Do not rewrite unrelated code.
- Do not remove user changes.
- Before finishing, run relevant verification commands.
- If verification fails, report the failure clearly and fix it when related to your change.
- Do not deploy production without explicit approval.

## Standard Workflow

1. Inspect relevant files and existing tests.
2. Identify the package manager, framework, and available scripts.
3. For broad or risky work, provide a short plan before editing.
4. Implement the requested change.
5. Run focused tests first.
6. Run lint, typecheck, and build when available.
7. Have SPECTRE review source, behavior, security, vulnerabilities, and deployment readiness.
8. Have SCION fix all in-scope SPECTRE findings.
9. Summarize changed files, verification results, SPECTRE findings, fixes, and deployment status.

## Common Commands

Update this section after inspecting the repo:

- Install: TODO
- Test: TODO
- Lint: TODO
- Typecheck: TODO
- Build: TODO
- Deploy staging: TODO
- Deploy production: GitHub Pages from `main` branch root, with custom domain `xotrix.buildjoynow.com`

## Deployment Policy

- Staging deploy is allowed only after tests/build pass.
- Production deploy requires explicit human approval.
- Never expose secrets in logs, commits, PRs, or chat.
- DNS changes for `buildjoynow.com` are external actions and must be reported clearly.

## Handoff Format

End each task with:

- What changed.
- Verification commands and results.
- Deployment status, if any.
- Risks or follow-ups.
