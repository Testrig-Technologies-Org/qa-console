This is the **Master App Manifest**. I have synthesized everything we have discussed—the file structures, the tech stack, the AWS hosting, and the strict security rules from your `AGENTS.md`—into one single source of truth.

You should save this as **`PROJECT_MASTER.md`** in your root directory.

---

# 📑 LendingWise: Master Project Manifest & Deployment Guide

## 1. Project Identity & Purpose
*   **App Name:** LendingWise Platform
*   **Industry:** Fintech (Financial and Personal Data)
*   **Primary Goal:** Secure, tenant-scoped lending management.
*   **Source of Truth:** All infrastructure and app details are stored in this Git repository.

---

## 2. Technical Stack (The "How")
*   **Frontend:** HTML5, Bootstrap, jQuery.
*   **Backend:** PHP (Strict ORM usage).
*   **Database:** MySQL (Cloud hosted on AWS RDS).
*   **Environment:** Dockerized containers for local and production.
*   **Infrastructure:** AWS (Amazon Web Services).

---

## 3. Repository Map (Key Files)
| File/Folder | Purpose | Critical Info |
| :--- | :--- | :--- |
| `/docs/` | Documentation Hub | Contains architecture, data dictionary, and API specs. |
| `AGENTS.md` | AI/Dev Instructions | Master navigation and rules for all contributors. |
| `.deepsource.toml` | Quality Gate | Scans PHP, JS, and Shell for bugs/security issues. |
| `.dockerignore` | Build Optimization | Prevents logs/cache from bloating the AWS image. |
| `.env.example` | Config Template | Shows required AWS/DB keys without exposing values. |
| `.gitignore` | Security Filter | Blocks `.env.local` and sensitive files from GitHub. |
| `Makefile` | Task Automation | Contains commands for setup and deployment. |

---

## 4. 🔐 The Golden Security Rules
*These rules are mandatory for every release. Failure to follow these results in a deployment block.*

1.  **Input Safety:** 
    *   Use `Request::GetClean()` for all parameters.
    *   Explicitly cast types: `(int)`, `(string)`.
2.  **Database Integrity:** 
    *   **NEVER** use raw SQL if the ORM can do it.
    *   **ORM requirement:** `->Save()` is required to trigger the **Automatic Field History** (Changelog).
    *   **Tenant Scoping:** All queries must include `PCID` (tenant ID).
3.  **Secrets:** 
    *   No hardcoded passwords or API keys.
    *   Load all sensitive data via `.env` variables.
4.  **PII Handling:** 
    *   Mask sensitive data (SSN, DOB) in all logs.

---

## 5. Deployment & Release Process (Target State)

### Phase 1: Local Development (Make/Docker)
*   Developers use `make` commands to spin up the Docker environment.
*   Local changes are tested against the `.env.local` configuration.

### Phase 2: The Quality Gate (CI)
Every Push/Pull Request triggers:
*   **DeepSource Scan:** Checks for security vulnerabilities.
*   **PHPUnit:** Runs functional tests.
*   **Linting:** Ensures coding standards match `/docs/DEV/coding-standards-php.md`.

### Phase 3: AWS Production Release (CD)
1.  **Build:** A Docker image is created (excluding files in `.dockerignore`).
2.  **Tag:** The release is tagged with a Semantic Version (e.g., `v1.4.0`).
3.  **Deploy:** The image is pushed to AWS (ECR/ECS).
4.  **Migrate:** Database changes are applied via tracked SQL scripts in `/database`.

---

## 6. Prohibited Actions (The "Do Not" List)
*   ❌ **No String Concatenation** for SQL queries (Prevents SQL Injection).
*   ❌ **No UUIDs:** The system strictly uses numeric IDs.
*   ❌ **No Caching:** Do not add Redis/Memcached unless specifically requested.
*   ❌ **No PII Logging:** Never write sensitive customer data to file logs.
*   ❌ **No Bypassing ORM:** Raw SQL skips the audit trail.

---

## 7. Next Steps for Improvement
1.  **Automate Versioning:** Implement a tool to auto-generate `CHANGELOG.md` from commit messages.
2.  **GitHub Actions:** Create a `.github/workflows/deploy.yml` that enforces the security checks in this document before allowing a push to AWS.
3.  **Health Monitoring:** Integrate AWS CloudWatch links into the `/docs/` folder to track live app performance.

---
**Last Updated:** 2024-05-21
**Status:** ✅ Documented & Aggregated

---

### How to use this file:
*   **When starting a task:** Read Section 4 (Security) and Section 6 (Prohibited Actions).
*   **When deploying:** Follow the steps in Section 5.
*   **When adding files:** Update the Map in Section 3.

**Does this look like it covers everything you need to track?** If so, your next step is to ensure your `Dockerfile` matches this manifest.