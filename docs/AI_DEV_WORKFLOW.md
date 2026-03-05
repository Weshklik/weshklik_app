# AI Development Workflow — Weshklik

This document defines the mandatory development rules for any AI-assisted work
(Codex, ChatGPT, Gemini, etc.) on the Weshklik codebase.

These rules are NON-NEGOTIABLE.

---

## 1. Branching Rules

### When to create an `exp` branch
All work MUST start in an `exp/*` branch.  
Direct changes on `main` are strictly forbidden.

### When to move to `S-dev`
A change may be promoted to `S-dev` ONLY if:
- The scope is minimal and explicit
- No regression is detected
- No refactor is introduced unless explicitly requested

### When and how `main` can be updated
`main` can only be updated:
- From `S-dev`
- After validation
- With zero regression tolerance
- While respecting strict domain separation

Workflow is ALWAYS:

---

## 2. Commit Rules

### Commit naming
Commits must clearly describe the targeted change.
Generic messages are forbidden.

### Commit size
Commits must be small, scoped, and reversible.

### Forbidden in commits
- Global refactors
- Breaking changes
- Domain mixing (Particulier / Pro / Import)
- Any violation of the locked form engine

---

## 3. Pull Request Rules

### Required PR structure
Every PR MUST include:
- Explanation of the change
- Impacted files
- Risk assessment

### What blocks a PR
- Any regression
- Any cross-domain contamination
- Any form engine violation
- Any refactor not explicitly approved

---

## 4. Change Safety Rules

### Sensitive zones (require explicit approval)
- Form engine & schemas (LOCKED)
- Routing / auth / dashboards
- Role-based access logic

### If uncertain
STOP.
Ask for clarification.
Never assume.

---

## 5. Interaction Rules (AI-specific)

- Ask before touching sensitive zones
- Do not code without explicit instruction
- Always explain diffs and risks
- Wait when instructions are ambiguous

---

This project is NOT a greenfield.
Preserve existing business logic and UX at all costs.
