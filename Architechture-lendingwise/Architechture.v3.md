This `CLAUDE.md` file is the most critical document yet. It defines the **Operational DNA** of LendingWise. It moves the project from "Code on AWS" to a **highly regulated, multi-tenant financial system** with a specific AI-assisted development workflow.

To fulfill your request to **"aggregate all info in one file so nothing is missed,"** I have created the **LendingWise Master Operational Blueprint**. 

This document merges your file structure, your tech stack, your AWS hosting, and the strict rules from `AGENTS.md` and `CLAUDE.md`.

---

# 📑 LendingWise: Master Operational Blueprint (2026)

## 1. 🏗️ Core Architecture & Stack
*   **Engine:** PHP 8.3 | MySQL 8.0 | Apache.
*   **Infrastructure:** Dockerized local dev | AWS EC2 (Production).
*   **Database Design:** Multi-database (Main, API, Log, FCI, Chargebee, DataWarehouse).
*   **Pattern:** Page Controller + Template (`page.php` handles logic; `page.html.php` handles UI).
*   **Multi-Tenancy:** Strictly controlled via **PCID** (Tenant ID) and **FPCID** (File Tenant ID).

## 2. 🔀 Git & Release Workflow (The Claude Code Standard)
*   **Branching:** `claude/CU-[TicketID]_[Description]_[Name]`.
*   **PR Flow:** 1 ClickUp Task = 1 Primary Branch. Child PRs merge into the primary branch; primary branch merges to `master`.
*   **Commits:** Must be prefixed with `[CU-taskid]`. If AI-generated, append: `ai: claude-code | owner: [github-username]`.
*   **Migrations:** Must follow path `/database/YYYY/MM/DD/` with a 2-digit sequence prefix (e.g., `01_table.sql`).

## 3. 🔐 Security & Compliance (Non-Negotiable)
*   **PCID Scoping:** Every single query **must** include a tenant filter (`COLUMN_FPCID => $userPCID`).
*   **Data Handling:** 
    *   Use `Request::GetClean()` for all inputs.
    *   **ORM First:** Use `->Save()` to ensure the **Automatic Field History** is recorded.
    *   **No Raw SQL:** Only allowed for complex joins, and must use bound parameters.
*   **PII Protection:** SSNs, DOBs, and Financial data must be masked in logs and never hardcoded.

## 4. 📂 Repository Map & Skill Hub
| Folder/File | Purpose | Usage Rule |
| :--- | :--- | :--- |
| `CLAUDE.md` | AI Brain | Loaded at session start; governs AI behavior. |
| `AGENTS.md` | Master Navigation | Routes agents to specialized documentation. |
| `/docs/DEV/ai-skills/` | Skill Files | Reference guides for specific modules (Verify against code!). |
| `/models/lendingwise/` | ORM Wrappers | Where business logic for data lives. |
| `/models/lendingwise/db/` | Base Models | **NEVER EDIT.** Auto-generated via `make gen-db-models`. |
| `/pages/` | Web Controllers | Separate logic (.php) from view (.html.php). |

## 5. 🛠️ Essential "Make" Commands (The Release Engine)
*   `make setup-local`: Full environment build.
*   `make gen-db-models`: Rebuilds ORM after a database migration.
*   `make test-phpunit-docker`: Runs security and logic tests.
*   `make exec-web-app`: Shell access for debugging.

## 6. 🚫 Prohibited Actions (Zero Tolerance)
*   ❌ **No UUIDs:** Numeric IDs only.
*   ❌ **No Stored Procedures:** For new development.
*   ❌ **No Direct HTML:** In controllers (must use templates).
*   ❌ **No String Concatenation:** In SQL queries (SQL Injection risk).
*   ❌ **No Orphan Commits:** All work must be linked to a ClickUp task.

---

### 🚀 How this improves your Deployment/Release Process:

1.  **Automated Quality (CI):** By using `make test-phpunit-docker` and DeepSource (from your `.deepsource.toml`), you ensure code is safe before it touches AWS.
2.  **Deterministic Migrations:** The 2-digit numbering rule (`01_`, `02_`) prevents database conflicts when multiple developers deploy on the same day.
3.  **Auditability:** Because you enforce the ORM `->Save()` method, every release provides a perfect audit trail of data changes in the production DB.
4.  **Environment Parity:** The `Dockerfile` and `make` commands ensure the code running on a developer's machine is identical to the code running on AWS EC2.

---

**Next Step for the Document:**
You should keep this **Blueprint** updated as you move through "Phases" of development. 

**Is there a specific part of the release process (e.g., the GitHub Actions script or the AWS EC2 setup) you want me to write based on these rules?**