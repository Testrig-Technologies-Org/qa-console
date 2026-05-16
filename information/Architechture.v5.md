# LendingWise Platform — Repository Documentation

<!--
Owner: Engineering Team
Last reviewed: 2026-05-16 (Full repo file audit — 31 files)
Scope: Complete reference documentation for all root-level and key subdirectory files
       in the LendingWise platform repository, including deployment pipeline details.
-->

---

## Table of Contents

1. [Repository Overview](#1-repository-overview)
2. [Environment & Configuration Files](#2-environment--configuration-files)
3. [Docker & Infrastructure](#3-docker--infrastructure)
4. [PHP Application Bootstrap](#4-php-application-bootstrap)
5. [Build & Automation (Makefile)](#5-build--automation-makefile)
6. [CI/CD Workflows](#6-cicd-workflows)
7. [AI Agent Control Files](#7-ai-agent-control-files)
8. [Documentation Standards](#8-documentation-standards)
9. [PHP Dependencies (composer.json)](#9-php-dependencies-composerjson)
10. [Node / Test Dependencies (package.json)](#10-node--test-dependencies-packagejson)
11. [Scripts Directory](#11-scripts-directory)
12. [Tasks Directory (Cron Engine)](#12-tasks-directory-cron-engine)
13. [Migration Tasks](#13-migration-tasks)
14. [Deployment Process — End to End](#14-deployment-process--end-to-end)
15. [AWS Account Structure](#15-aws-account-structure)
16. [Multi-Tenant Architecture Reference](#16-multi-tenant-architecture-reference)
17. [Multi-Database Structure Reference](#17-multi-database-structure-reference)

---

## 1. Repository Overview

LendingWise is a **fintech lending platform** (loan origination, processing, and management) built on:

- **PHP 8.3** — backend
- **MySQL 8.0** — primary database (6 separate databases)
- **jQuery + Bootstrap 4 (Metronic)** — frontend
- **Docker + Apache** — local development and production containers
- **AWS ECS** — production hosting
- **AWS ECR** — container image registry

The codebase is a mature monolith with multiple third-party integrations (Sendgrid, Twilio, Chargebee, Authorize.net, Google APIs, MicroBilt, FaxAge, Vitelity, and more). Security is the highest priority — the system handles personal and financial data for thousands of loan files across multiple tenant companies.

**Three sibling repositories** are mounted together during local development:

| Repo | Mount path in Docker |
|---|---|
| `lendingwise` (this repo) | `/var/www/html/lendingwise` |
| `api` | `/var/www/html/api` |
| `upload` | `/var/www/html/upload` |

---

## 2. Environment & Configuration Files

### `.deepsource.toml`

**Purpose:** Static code analysis configuration for the DeepSource CI integration.

**Analyzers configured:**

| Analyzer | Notes |
|---|---|
| `php` | PHP code quality and security analysis |
| `javascript` | JS analysis with jQuery environment flag |
| `shell` | Shell script analysis |

The `jquery` environment flag prevents false positives on `$` and jQuery globals throughout the codebase.

---

### `.env.default`

**Purpose:** Master environment variable template. The source of truth for all env vars used by the application. Used by `make create-env-file` to generate the working `.env` for local dev.

**Two sections:**

**Section 1 — Committed plain vars** (safe to version control, no secrets):

| Variable | Purpose |
|---|---|
| `APP_ENV` | `development` / `staging` / `production` |
| `APP_URL`, `APP_SSL_URL`, `APP_CRON_SERVER_URL` | Application URLs |
| `APP_DEBUG` | Debug mode flag |
| `APP_ENC` | Encryption enabled |
| `LOG_ERRORS`, `LOG_QUERIES` | Logging toggles |
| `OUTPUT_ERRORS`, `OUTPUT_ERRORS_FILE` | Error display flags |
| `SLOWQUERYTIME`, `ALERTTOSLOWQUERIES` | Slow query thresholds |
| `AMAZON_S3_BUCKET`, `AMAZON_S3_URL` | S3 storage config |
| `DATA_LW_API`, `DATA_LW_CHARGEBEE`, `DATA_LW_DATAWAREHOUSE`, `DATA_LW_FCI`, `DATA_LW_LOG` | Database name constants |
| `TZ` | Timezone (`US/Eastern`) |
| `WEBSOCKET_PORT` | WebSocket server port |
| `FORCE_HTTPS` | HTTPS redirect flag |
| `RECAPTCHA_DISABLE` | reCAPTCHA bypass for dev |
| `GOOGLE_API_MODE` | `local` / `production` |
| `PRICING_ENGINE_ENV`, `PRICING_ENGINE_KEY` | LoanPass config |

**Section 2 — Commented-out secrets** (stored in AWS Secrets Manager in production):

All sensitive vars use the `___SECRET_IN_SSM___` placeholder. Examples:

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` — database credentials
- `SENDGRID_API_KEY`, `SENDGRID_MARKETING_API_KEY`, `SENDGRID_SPOOF_API_KEY`
- `BUGSNAG_API_KEY`
- `TWILIO_2FA_SID`, `TWILIO_2FA_TOKEN`, `TWILIO_SMS_SERVICEID`
- `MCRYPT_KEY`, `MCRYPT_IV` — encryption keys
- `AUTH_NET_USER_ID`, `AUTH_NET_TRANSACTION_KEY` — Authorize.net
- `FAX_AGE_USERNAME`, `FAX_AGE_PASSWORD`, `FAX_AGE_COMPANY`, `FAX_AGE_HOSTNAME`
- `VITELITY_LOGIN`, `VITELITY_PASSWORD`, `VITELITY_DID`
- `MICROBILT_KEY`, `MICROBILT_SECRET`
- `GOOGLE_CAPTCHA_SECRET_KEY`, `GOOGLE_MAPS_API_KEY`
- `PLAYWRIGHT_PDF_TOKEN`
- `CYPRESS_RECORD_KEY`

**Developer note:** You may uncomment and set any of the secret vars locally for development purposes only. They must never be committed.

---

### `.env.example`

**Purpose:** Minimal env key list for API repo setup. Contains no secret values — just the key names with empty or safe default values. Used as the template for `../api/.env` during `make setup-local`.

---

### `.env.local`

**Purpose:** Empty placeholder file. Reserved for machine-specific local overrides that are never committed.

---

### `.gitattributes`

**Purpose:** Forces LF (Unix) line endings for all `.sh` files.

```
*.sh text eol=lf
```

This prevents Windows/WSL from converting shell scripts to CRLF, which breaks execution inside the Docker container.

---

### `.gitignore`

**Purpose:** Comprehensive ignore list. Key categories:

| Category | Examples |
|---|---|
| OS files | `.DS_Store`, `Thumbs.db`, `*.swp` |
| Logs & databases | `*.log`, `*.sqlite` |
| Uploaded documents | `PCUpDoc/`, `LMRFileDoc/`, `trustDocs/`, `branchLogo/`, `brokerLogo/` |
| Generated assets | `public/assets/css/cache/`, `public/assets/js/cache/`, `public/assets/css/compiled/`, `public/assets/js/compiled/` |
| Sensitive config | `.env`, `config.php`, `pops/popsConfig.php` |
| Auto-generated models | `/models/lendingwise_api/db`, `/models/lendingwise_chargebee/db`, `/models/lendingwise_fci/db`, `/models/lendingwise_log/db`, `/models/lendingwise_datawarehouse/db` |
| Test artifacts | `cypress/screenshots/`, `cypress/videos/`, `cypress/downloads/`, `.phpunit.result.cache` |
| Node | `node_modules` |
| Vendor | `vendor/` |
| Dev secrets | `/composer.lock`, `keys/` |

**Notable:** `models/lendingwise/tblFileHistory.php` is also ignored — it's a generated file, not manually maintained.

---

### `config.php`

**Purpose:** Central PHP application configuration. Reads all `$_ENV` vars and defines PHP constants used throughout the codebase. This file is in `.gitignore` and must never be committed (it contains active credential bindings at runtime).

**What it defines (200+ constants):**

**Database connections:**
```php
define('DB_HOST', $_ENV['DB_HOST']);      // main DB host
define('DB_NAME', $_ENV['DB_NAME']);      // main DB name
define('DATA_LW_API', $_ENV['DATA_LW_API']);
define('DATA_LW_LOG', $_ENV['DATA_LW_LOG']);
define('DATA_LW_FCI', $_ENV['DATA_LW_FCI']);
define('DATA_LW_CHARGEBEE', $_ENV['DATA_LW_CHARGEBEE']);
define('DATA_LW_DATAWAREHOUSE', $_ENV['DATA_LW_DATAWAREHOUSE']);
```

**Site URL handling:** Dynamically determines site URL from `HTTP::url()` with staging override support via `?HTTP_HOST=` query param.

**Email constants:** `CONST_EMAIL_FROM`, `CONST_EMAIL_SUPPORT`, `CONST_EMAIL_CC`, `CONST_EMAIL_ADMIN`, etc.

**Third-party service constants:** Sendgrid SMTP settings, MetroFax URL/credentials, REST report WSDL, Authorize.net URLs, FaxAge credentials, Vitelity fax, Chargebee, Twilio, MicroBilt, Google APIs.

**Path constants:** `CONST_PATH`, `CONST_ROOT_PATH`, `CONST_LMR_FILE_DOC_PATH`, `CONST_BRANCH_LOGO_PATH`, `CONST_PC_LOGO_URL`, etc.

**File upload limits:**
```php
const CONST_GLUPLOAD_MAX_MBFILESIZE = '175MB';
const CONST_GLUPLOAD_MAX_BYTESFILESIZE_ALLOWED = 175 * 1024 * 1024;
const CONST_EMAIL_MAX_FILE_SIZE_ALLOWED = 10485760; // 10MB for email attachments
```

**Environment-specific config:**
```php
if (CONST_ENVIRONMENT == 'production') {
    $apiAcessPC = ['3946'];
} elseif (CONST_ENVIRONMENT == 'staging') {
    $apiAcessPC = ['1'];
} else {
    $apiAcessPC = ['338']; // development
}
```

**SMTP initialization:** Builds `$SMTPInfoArray` and `$SMTPAPIInfoArray` for 4 sender identities (standard, spoofing, marketing, SMS) and calls `SMTPInfo::Init()`.

**Project root discovery:** Dynamic `find_project_root()` function walks upward until it finds `composer.json`, then defines `PROJECT_ROOT`.

---

### `constants.php`

**Purpose:** Intentionally blank placeholder file. Required by `config.php` but kept empty. Historical artifact — legacy per-PC constants were here but have been moved to the database.

> ⚠️ **DO NOT EDIT** this file.

---

### `custom-php.ini`

**Purpose:** PHP ini overrides applied inside the Docker container.

| Setting | Value | Reason |
|---|---|---|
| `display_errors` | `On` | Show errors in local dev |
| `display_startup_errors` | `On` | Show startup errors |
| `error_reporting` | `E_ALL` | Full error visibility |
| `max_input_vars` | `10000` | Supports large form submissions (loan applications have hundreds of fields) |
| `output_buffering` | `4096` | Standard buffering |
| `precision` | `14` | Float precision |

---

### `js_version.php`

**Purpose:** Generates cache-busting version strings for CSS and JS assets. Uses the current git commit hash so assets are invalidated on every deploy.

```php
$jsVr = $cssVr = Git::gitHash();
define('CONST_JS_VERSION', trim($jsVr));
define('CONST_CSS_VERSION', trim($cssVr));
```

These constants are appended to asset URLs as query strings (e.g., `style.css?v=a1b2c3d`).

---

## 3. Docker & Infrastructure

### `Dockerfile`

**Base image:** `php:8.3-apache`

**Timezone:** `America/New_York` (set at container level)

**PHP extensions installed:**

| Extension | Purpose |
|---|---|
| `gd` | Image manipulation |
| `intl` | Internationalization |
| `mbstring` | Multi-byte strings |
| `mysqli`, `pdo_mysql` | MySQL connectivity |
| `soap` | SOAP web services (RAMServicing, REST Report) |
| `bcmath` | Arbitrary precision math (loan calculations) |
| `calendar`, `exif`, `pcntl` | Utility extensions |
| `imagick` | ImageMagick PHP binding |
| `mcrypt` | Legacy encryption (custom-compiled for PHP 8.3 — not yet in official PECL) |
| `xdebug` | Remote debugging (port 9003) |
| `apcu` | In-memory caching (Google job state) |
| `mailparse` | Email parsing |

**System packages:** LibreOffice (Writer, Calc, Common) for DOCX/XLSX generation, GhostScript for PDF manipulation.

**XDebug config** (from `scripts/xdebug.ini`):
```ini
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
xdebug.idekey=PHPSTORM
```

**Apache virtual hosts** (all on port 80):

| ServerName | DocumentRoot | Purpose |
|---|---|---|
| `local.lendingwise.com` | `/var/www/html/lendingwise/public` | Main app |
| `apilocal.lendingwise.com` | `/var/www/html/api` | API server |
| `uploadlocal.lendingwise.com` | `/var/www/html/upload` | Upload server |

**Build steps:**
1. Install system dependencies and PHP extensions
2. Install MySQL client tools
3. Compile mcrypt from GitHub source (PHP 8.3 compatibility workaround)
4. Install Composer globally
5. Copy application code into image
6. Run `composer install --no-dev --optimize-autoloader`
7. Configure Apache virtual hosts
8. Create required directories (`public/temp`, `/tmp/esign`, `/var/www/.config`)
9. Set global git safe directories and hooks path
10. `chown -R www-data:www-data` + `chmod -R 777` on web root

**Exposed port:** 80

---

### `docker-compose.yml`

**Services:**

#### `app` (container: `lendingwise_app`)

Builds from local `Dockerfile`. Mounts:

| Host path | Container path | Notes |
|---|---|---|
| `./` | `/var/www/html/lendingwise` | Main app code (live reload) |
| `../api` | `/var/www/html/api` | API repo |
| `../upload` | `/var/www/html/upload` | Upload repo |
| `../apilocal.lendingwise.com.php` | `/var/www/html/apilocal.lendingwise.com.php` | API secret key (read-only) |
| `../data_lendingwise` | `/var/www/html/data_lendingwise` | Shared file storage (mimics EFS) |
| `esign_tmp` (named volume) | `/tmp/esign` | E-sign temp files |

Environment vars passed from `.env` file (DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_TYPE).

**Startup command** (after container init): Creates all data subdirectories, copies upload config, runs `composer update` for the upload repo, then starts `apache2-foreground`.

**Depends on:** `db` service health check.

Extra hosts (for container-to-container routing):
- `local.lendingwise.com` → `127.0.0.1`
- `apilocal.lendingwise.com` → `host-gateway`
- `uploadlocal.lendingwise.com` → `host-gateway`

#### `db` (container: `lendingwise_db`)

MySQL 8.0 with custom settings:

| Setting | Value |
|---|---|
| `MYSQL_DATABASE` | `lendingwise_local` |
| `MYSQL_USER` | `local_user` |
| `MYSQL_PASSWORD` | `local_pwd` |
| `MYSQL_ROOT_PASSWORD` | `super12345` |
| `innodb-buffer-pool-size` | `512M` |
| `max-allowed-packet` | `256M` |
| `sql-mode` | `""` (disabled — legacy compatibility) |
| `character-set-server` | `utf8mb4` |
| `collation-server` | `utf8mb4_unicode_520_ci` |
| `tls-version` | `TLSv1.2,TLSv1.3` |

Health check: `mysqladmin ping -h localhost -u root -p'super12345'` every 20s, 5 retries, 30s start period.

Initialization SQL directory: `./db-init` mapped to `/docker-entrypoint-initdb.d`.

**Named volumes:**
- `mysql_data` — persists DB data between container restarts
- `esign_tmp` — shared esign temp files between app and upload

**Network:** `lendingwise_network` (bridge driver)

---

## 4. PHP Application Bootstrap

### `modules.php`

**Purpose:** Main bootstrap file. Required at the start of every PHP request and CLI script.

**What it does:**

1. Defines financial calculation constants:
   ```php
   const FINANCIAL_MAX_ITERATIONS = 128;
   const FINANCIAL_PRECISION = 1.0e-08;
   ```

2. Loads Composer autoloader (`vendor/autoload.php`)

3. Loads core lib files: `debugger.php`, `env.php`, `bugsnag.php`, `Debug.php`

4. Registers **two PSR-4 autoloaders**:
   - **Primary:** Maps namespace to file path directly (e.g., `models\Foo` → `models/Foo.php`)
   - **Fallback:** Strips `models/` prefix and re-checks the `models/` directory — handles inconsistent namespacing in legacy code

5. Requires specific utility files:
   - `functions/stateOfForeclosureSummary.php`
   - `lib/math/MathClass.php`, `lib/math/PrincipalInterest.php`
   - `functions/imageUtil.php`, `functions/legalContractPdf.php`
   - `functions/loanServicingSummaryFormula.php`, `functions/pkgUtilFunctions.php`
   - `modules_functions_pdf.php`

---

### `modules_functions_pdf.php`

**Purpose:** Tiny bootstrap file that loads PDF utility functions. Kept separate for clean separation of concerns.

```php
require_once __DIR__ . '/functions/pdf/SBAFunctions.php';
```

---

### `js_version.php`

See [§2 Environment & Configuration Files](#2-environment--configuration-files) above.

---

### `params.php`

**Purpose:** Legacy parameter file. All content is commented out. Historical artifact from when per-PC configuration was stored as PHP global variables rather than in the database.

> ⚠️ **DO NOT EDIT** this file. The comment explicitly states this.

---

## 5. Build & Automation (Makefile)

**Purpose:** Developer convenience wrapper for all common local development operations. Every `make` target is documented with `##` comments and shown in `make help`.

### Complete Target Reference

| Target | Description |
|---|---|
| `make setup-local` | **First-time setup** — runs: `preflight`, `install-git-hooks`, `create-env-file`, `create-temp-folder`, `remove-composer-lock`, `up`, `api-secret`, `gen-db-models` |
| `make up` | Start Docker containers (+ regenerate API secret if missing) |
| `make down` | Stop Docker containers |
| `make gen-db-models` | Regenerate all ORM model files from DB schema (runs composer install in all 3 repos, waits for MySQL, runs generateModelsV2.php) |
| `make composer-update` | Run `composer update` inside Docker |
| `make reset` | Full environment reset — tears down containers, volumes, images, removes composer.lock, re-runs setup-local |
| `make create-env-file` | Copy `.env.default` → `.env` with `OUTPUT_ERRORS=1`. Backs up existing `.env` if present |
| `make create-temp-folder` | Create `public/temp/` with 777 permissions |
| `make install-git-hooks` | Configure git to use `.githooks/` directory. Sets `pull.rebase false` |
| `make remove-composer-lock` | Delete `composer.lock` if it exists |
| `make api-secret` | Generate `../apilocal.lendingwise.com.php` with random `MASTER_SECRET_KEY` (openssl rand -hex 100) |
| `make preflight` | Verify `../api` (on `release_v3.2`), `../upload`, and `../data_lendingwise` all exist |
| `make open-local-app` | Open `http://local.lendingwise.com/` in browser |
| `make exec-web-app` | Shell into `lendingwise_app` container |
| `make exec-api` | Shell into container and cd to `../api` |
| `make create-api-creds EMAIL=x PCID=y` | Create API account via `createAPIAccount.php` |
| `make create-api-creds-dave` | Create API account for dave@lendingwise.com / PCID 3580 |
| `make install-cypress` | Install Cypress browser via npm |
| `make open-cypress` | Open Cypress E2E UI |
| `make test-cypress-unit` | Run Cypress component tests via CLI |
| `make test-cypress-e2e` | Run Cypress E2E tests via CLI |
| `make test-phpunit` | Run PHPUnit locally (requires composer install) |
| `make test-phpunit-docker` | Run PHPUnit inside Docker container |
| `make check-debug` | Verify XDebug is installed and configured |
| `make help` | Show all available targets with descriptions |

### `make setup-local` — Step by Step

```
1. preflight
   - Checks ../api exists and is on branch release_v3.2
   - Checks ../upload exists
   - Creates ../data_lendingwise if missing (chmod 777)

2. install-git-hooks
   - git config core.hooksPath .githooks
   - git config pull.rebase false
   - chmod +x .githooks/*

3. create-env-file
   - cp .env.default → .env (with OUTPUT_ERRORS=0 changed to 1)
   - Backs up ../api/.env if it exists
   - cp ../api/.env.sample → ../api/.env

4. create-temp-folder
   - mkdir -p public/temp && chmod 777 public/temp

5. remove-composer-lock
   - rm -f composer.lock

6. up (→ api-secret)
   - docker compose up -d
   - Creates ../apilocal.lendingwise.com.php with random MASTER_SECRET_KEY

7. gen-db-models
   - composer install in lendingwise, api, and upload
   - Wait for MySQL health check
   - php scripts/generateModelsV2.php
   - bash api/tasks/generateModels.local.sh
```

**Post-setup output:** Displays URLs, login credentials (`dave@lendingwise.com` / `simple`), and hosts file instructions.

---

## 6. CI/CD Workflows

### `ci_cd_dev_staging.yml` — Auto Deploy (Dev & Staging)

**Trigger:** Push to `develop` or `master` branches.

**Environment mapping:**

| Branch | AWS Account | Tag suffix |
|---|---|---|
| `develop` | Dev (757278011057) | `:dev-latest` |
| `master` | Staging (020359319387) | `:latest` |

#### Job 1: `build_deploy`

| Step | Details |
|---|---|
| Checkout | Full repo checkout |
| Assume AWS role | OIDC-based role assumption (branch-determined account) |
| Docker Compose up | Starts app + db containers |
| Run PHPUnit | `XDEBUG_MODE=off` — coverage disabled for speed |
| Build Docker image | Tags: `{ECR_REGISTRY}/lendingwise-legacy:{git-hash}` + `:latest` or `:dev-latest` |
| Push to ECR | Registry: `685551735768.dkr.ecr.us-east-2.amazonaws.com` |
| Force-deploy ECS | Cluster: `lendingwise-legacy`, Service: `lendingwise-service` |
| Notify ClickUp | Updates the ClickUp task linked to the PR |

#### Job 2: `post-deploy-testing`

**Depends on:** `build_deploy` job completion.
**Matrix:** 10 parallel runners, `fail-fast: false`.

| Step | Details |
|---|---|
| Sleep 120s | Wait for ECS deployment to complete |
| Verify version | Hit `/version.json` endpoint and confirm git hash matches |
| Run Cypress E2E | Via `.github/test.sh` |
| Notify ClickUp | Test pass/fail result |

---

### `prod_deploy.yml` — Manual Production Deploy

**Trigger:** `workflow_dispatch` (manual only — requires human action).

**Inputs:**
- `action`: `deploy` or `scaleback`
- `image_id` (optional): specify a specific ECR image tag to deploy (defaults to current Staging image)

> ⚠️ **Known bug:** If `action` input is left blank, both `deploy` and `scaleback` jobs run simultaneously. Always specify the action explicitly.

#### Job: `deploy`

| Step | Details |
|---|---|
| Assume Staging role | Read current Staging ECS task definition |
| Extract image | Get the container image from Staging's task def (or use `image_id` input) |
| Assume Prod role | Switch to account 098824477113 |
| Update task definition | Use `jq` to inject Staging image into Prod task def |
| Ensure RDS size | Upsize to `db.t3.medium` if currently smaller |
| Set ECS desired count | Ensure at least 1 task running |
| Wait | Wait for tasks-running state |
| Notify ClickUp | Deployment complete notification |

**Key principle:** Production always runs the image that was already validated on Staging. No rebuild in production. "Promote, don't rebuild."

#### Job: `scaleback`

| Step | Details |
|---|---|
| Assume Prod role | Switch to production account |
| Scale ECS to 0 | Set desired count = 0 |
| Downsize RDS | Resize to `db.t3.micro` |
| Notify ClickUp | Via direct `curl` to ClickUp API |

Used to reduce costs when production is not needed (maintenance windows, off-hours).

---

## 7. AI Agent Control Files

### `AGENTS.md`

**Loaded by:** GitHub Copilot, Cursor, and other AI agents that respect `AGENTS.md`.
**Purpose:** Master routing document — tells AI agents where to find documentation and enforces critical security rules.

#### Security Rules (Never Compromise)

**Input validation:**
- Use ORM methods instead of raw SQL
- Use `Request::GetClean()` for all request parameters
- Cast values explicitly: `(int)`, `(float)`, `(string)`
- Use bound parameters for complex raw SQL JOINs
- Never trust client-side validation alone
- Never concatenate strings into SQL queries
- Never use unsanitized user input

**Secrets management:**
- Load secrets from `.env` only
- Mask sensitive data in logs
- Never hardcode API keys, passwords, or tokens
- Never log PII (SSN, DOB, financial data, auth tokens)
- Never commit `.env` files

**Database operations:**
- Wrap multi-step DB writes in transactions
- Always scope queries by PCID
- Never bypass tenant scoping
- Never run destructive operations without transactions

#### Documentation Routing Table

| Task | Document |
|---|---|
| Find where code lives | `/docs/ARCHITECTURE/repo-folder-map.md` |
| System architecture | `/docs/ARCHITECTURE/architecture-overview.md` |
| Database changes / migrations | `/docs/DATA/database-overview.md` |
| Field meanings / data dictionary | `/docs/DATA/data-dictionary.md` |
| Business domain concepts | `/docs/DATA/domain-concepts.md` |
| API development | `/docs/ARCHITECTURE/api-public-and-internal.md` |
| Permissions / authorization | `/docs/ARCHITECTURE/permissions-and-roles.md` |
| Background jobs / cron | `/docs/ARCHITECTURE/background-jobs-and-cron.md` |
| Security requirements | `/docs/ARCHITECTURE/security-and-compliance.md` |
| Testing strategy | `/docs/ARCHITECTURE/testing-strategy.md` |
| PHP coding standards | `/docs/DEV/coding-standards-php.md` |
| Step-by-step workflow | `/docs/DEV/ai-agent-workflow.md` |
| Known/unknown patterns | `/docs/DEV/ai-knowledge-map.md` |

#### What NOT to Do

- Do not propose UUID or hashed IDs (system uses numeric IDs throughout)
- Do not suggest Redis/Memcached/caching without explicit request
- Do not recommend major refactors for legacy code (hotfixes only)
- Do not refactor code outside task scope
- Do not add comments to unchanged code
- Do not over-engineer solutions
- Do not skip reading existing code before modifying

---

### `CLAUDE.md`

**Loaded by:** Claude Code automatically at every session start.
**Purpose:** Complete operating instructions for AI-assisted development on this codebase.

#### Git Workflow Rules

**Branch naming format:**
```
claude/CU-[ticketid]_[Description]_[Name]
```
Example: `claude/CU-868j1jdub_Setup-Loan-File-Routing_Miguel-F`

**PR targeting rules:**
- First Claude session for a feature → PR targets `master`
- Continuation sessions → PR targets the parent branch (not `master`)
- One ClickUp task = one primary branch = one PR into master

**Commit format:**
```
[CU-abc123] Description of what and why

ai: claude-code | owner: [github-username]
```

**PR description must include:** Session owner, summary of changes, files modified, new tables/endpoints, testing notes.

#### Team GitHub Username Registry

| Name | GitHub Username |
|---|---|
| Miguel Feal | miguelfeal |
| Daniel Tullio | danielwise777 |
| Chris Fuelling | cff2880 |
| Sainath | sainathlendingwise |
| Deepthi | deepthi8106 |
| Murali Krishna | murali565 |
| Nikhil | nikhil-lw |
| Dave Eschmeyer | DaveEschmeyer |
| Abhinav Chauhan | abhinav-chauhan-lw |
| Nikita Somani | nikita-somani-1 |
| Vaibhav Pawar | vaibhav212303 |
| Attaf | attaf-lendingwise |

#### Context Budget Rules

| Task Type | Load | Token Budget |
|---|---|---|
| Trivial bug fix | CLAUDE.md + 1 skill file | ~5,000 |
| Standard feature | CLAUDE.md + 1 skill + 1 arch doc | ~10,000 |
| Complex feature | CLAUDE.md + 2 skills + 2 arch docs | ~18,000 |
| Maximum | Any combination | ~40,000 (20% of context max) |

#### Skill File Maintenance Tiers

**Tier 1 — During task (inline):**
Add new columns to schema tables, new controller methods, changed permission checks. Keep to specific rows affected by your change.

**Tier 2 — Pre-merge audit (same branch):**
Run dedicated Claude Code session before PR approval. Command:
```
git diff master -- . ':!docs/'
```
Then update skill files to match. Commit on the same feature branch so docs and code ship together.

**Tier 3 — Quarterly full audit:**
Run against a specific skill file to catch cumulative drift. Verify file paths, table columns, conditional logic. Flag discrepancies with `⚠️ NEEDS VERIFICATION`.

#### Reuse-First Development

Before creating any new function, class, helper, query, table, or column:

| Need | Search first |
|---|---|
| Query/filter data | `/models/lendingwise/*.php`, `/models/composite/` |
| Format/transform data | `/functions/`, model traits |
| Controller action | `/models/Controllers/` (add method, don't create new controller) |
| UI component | `/pages/` partials and shared templates |
| Store new data | Existing tables/columns first |
| Permission checks | `UserAccess::` methods |
| Send notifications | `/models/Controllers/`, `/tasks/` |
| Background work | `/tasks/` existing patterns |

If you must create something new, state in commit message why existing code couldn't be reused.

#### Database Migration Convention

```
/database/{YEAR}/{MONTH}/{DATE}/{TICKET-ID}-{DEVELOPER}/{NN}_{tableName}.sql
```

Example: `/database/2026/03/06/CU-abc123-Sai/01_tblNewFeature.sql`

**Numbering rules:**
- `NN` = zero-padded sequence, scoped to the **day folder** (across all tickets that day)
- Check existing files: `ls database/{YEAR}/{MONTH}/{DATE}/*/`
- If your migration depends on another, your number must be higher
- Never reuse a number; never renumber another developer's migration

**Migration file requirements:**
- `IF NOT EXISTS` on CREATE TABLE
- `IF EXISTS` on DROP statements
- Index all foreign keys and frequently queried columns
- `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
- Always run `make gen-db-models` after running migrations

#### Security Rules (detailed)

**PCID Tenant Scoping — CRITICAL:**
```php
// GOOD — scoped by PCID
$loans = tblFile::GetAll([
    tblFile_db::COLUMN_FPCID => $userPCID,
    tblFile_db::COLUMN_STATUS => 'active'
]);

// BAD — cross-tenant data leak
$loans = tblFile::GetAll([tblFile_db::COLUMN_STATUS => 'active']);
```

**ORM-first data access:**
```php
// GOOD — ORM method
$loan = tblFile::Get([
    tblFile_db::COLUMN_LMRID => $loanId,
    tblFile_db::COLUMN_FPCID => $userPCID
]);

// GOOD — complex query with bound params
$sql = 'SELECT * FROM tblARConditions WHERE status = :status AND id = :id';
$sqlParams = ['status' => 1, 'id' => $id];
return Database2::getInstance()->queryData($sql, $sqlParams, null, true);

// BAD — SQL injection risk
$query = "SELECT * FROM loans WHERE id = " . $loanId;
```

#### Codebase Architecture Quick Reference

| Directory | Purpose | Editable? |
|---|---|---|
| `/models/Controllers/` | Business logic controllers | Yes |
| `/models/lendingwise/*.php` | ORM wrappers | Yes |
| `/models/lendingwise/db/*.php` | Auto-generated ORM base | **NEVER** |
| `/models/Database2.php` | ORM base class | Yes |
| `/models/composite/` | Multi-table operations | Yes |
| `/pages/` | MVC page controllers + templates | Yes |
| `/public/` | Web root, entry points, static assets | Yes |
| `/tasks/` | Cron jobs and background tasks | Yes |
| `/database/` | SQL migrations | Yes |
| `/functions/` | Shared utility functions | Yes |
| `/tests/phpunit/` | PHPUnit test suite | Yes |
| `/playwright/` | Playwright E2E tests | Yes |

**User role vs user group distinction:**
- `$userRole` → authorization (what powers the user has): `Agent`, `Branch`, `Client`, `Super`, `Manager`, `Auditor`
- `$userGroup` → portal routing (where the user lives in the system): `Super`, `Sales`, `Employee`, `Branch`, `Agent`, `Client`, `Broker`

---

### `Review.md`

**Loaded by:** Claude Code during `/review`, GitHub Copilot review action.
**Purpose:** The PR review rulebook.

#### Priority Tiers

| Tier | Label | Meaning | Effect |
|---|---|---|---|
| P0 | 🔴 BLOCKER | Security, data leak, broken contract | Block merge |
| P1 | 🟠 MUST-FIX | Quality, reuse violation, scope creep | Fix before merge |
| P2 | 🟡 SUGGESTION | Minor improvement | Author's call |
| P3 | 🟢 PRAISE | Good patterns to reinforce | Positive signal |

#### P0 Blockers (Complete List)

1. **Missing PCID/FPCID tenant scoping** — query on `tblFile`, `tblClient`, `tblPCUsers`, etc. without PCID filter
2. **SQL injection** — any string concatenation or interpolation in raw SQL
3. **Hardcoded secrets** — API keys, passwords, tokens in code
4. **PII in logs** — SSN, DOB, full names+financials, auth tokens in any log call
5. **Auto-generated model edits** — any change to `/models/lendingwise/db/`
6. **Missing transactions on multi-step DB writes** — 2+ table writes without begin/commit/rollback
7. **Unsanitized request input** — direct use of `$_GET`, `$_POST`, `$_REQUEST` without `Request::GetClean()`
8. **Client-side-only validation** — new write path without server-side check
9. **New stored procedures** — no new SPs for new features (legacy only)

#### P1 Must-Fix (Key items)

- **Reuse violations** — new helper/model/controller when existing one would work
- **Scope creep** — changes outside the stated ClickUp task
- **Missing type hints on new code** (not legacy)
- **Error handling gaps** — DB writes without try/catch, external API calls without timeout handling
- **Migration file issues** — wrong path, missing index, missing InnoDB clause, no `make gen-db-models` note
- **Skill file drift** — schema/route/permission changes without updating relevant skill file

#### What NOT to flag

- Whitespace, indentation, trailing newlines
- PHPDoc wording
- Import ordering
- Type hints on untouched legacy methods
- Working code that uses a different style

#### Review Summary Template

```
## Review Summary
**Verdict:** [APPROVE | REQUEST CHANGES | COMMENT]
**ClickUp task:** CU-xxxxxx
**Scope check:** [In scope | Out-of-scope changes present]

- 🔴 Blockers: N
- 🟠 Must-fix: N
- 🟡 Suggestions: N
- 🟢 Praise: N

**Top actions for author:**
1. [most important]
2. [second]
3. [third, if any]
```

---

## 8. Documentation Standards

### `Master-MD-File-instructions.txt`

**Purpose:** Defines the conventions that ALL documentation files in `/docs` must follow. This is the style guide for the documentation system.

#### Required Front-Matter

Every doc must start with:
```html
<!--
Owner: [Team or individual]
Last reviewed: YYYY-MM-DD (Reason: ...)
Scope: Brief 1-line description
-->
```

#### Markdown Formatting Rules

- ATX headers (`#`, `##`, `###`) — max 4 levels
- Hyphens (`-`) for unordered lists, not asterisks
- Triple backtick code blocks with language specifier
- Relative paths for all internal links
- Blank lines before and after all headers, lists, tables, code blocks

#### Section Requirements (in order)

1. Front-matter HTML comment
2. Title (`#` header)
3. Purpose statement (1–3 sentences)
4. Main content sections (`##`)
5. "See Also" section (min 2–3 links)
6. "Last Updated" line at very bottom

#### Unknown Markers

Use these when information is unclear or missing:

- `<<UNKNOWN>>` — pattern not yet discovered
- `<<FILL: description>>` — placeholder for specific value

Always pair an `<<UNKNOWN>>` with discovery steps (files to read, grep commands, expected outcomes).

#### When to Split vs Extend

**Extend when:** Content fits naturally, total doc < 500 lines, same audience.
**Split when:** Doc exceeds 500 lines AND has clear natural boundaries, different audiences need different docs.

#### Emoji Policy

Approved emojis (headers only, one per header):
`🎯` goal, `✅` requirement, `❌` bad practice, `⚠️` warning, `🚫` stop condition, `📋` checklist, `🔐` security, `🔥` high priority, `📚` documentation, `🏗️` architecture, `🔧` configuration, `🧪` testing

---

## 9. PHP Dependencies (`composer.json`)

**PHP requirement:** `^8.3`

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `guzzlehttp/guzzle` | `~7.10` | HTTP client for external API calls |
| `sendgrid/sendgrid` | `~8` | Sendgrid email integration |
| `monolog/monolog` | `^2.5` | Logging framework |
| `bugsnag/bugsnag` | `^3.0` | Error monitoring |
| `vlucas/phpdotenv` | `^5.6` | `.env` file loading |
| `twilio/sdk` | `^8.7` | SMS and 2FA |
| `firebase/php-jwt` | `^7.0` | JWT token handling |
| `tecnickcom/tcpdf` | `^6.6` | PDF generation |
| `setasign/fpdi` | `^2.3` | PDF merging/stamping |
| `setasign/fpdf` | `^1.8` | PDF base library |
| `setasign/fpdi-tcpdf` | `^2.3` | TCPDF + FPDI bridge |
| `phpoffice/phpspreadsheet` | `^1.25.2` | Excel generation |
| `cboden/ratchet` | `^0.4.4` | WebSocket server |
| `phpseclib/phpseclib` | `^3.0` | SSH, SFTP, cryptography |
| `phpseclib/mcrypt_compat` | `^2.0` | mcrypt compatibility layer |
| `chargebee/chargebee-php` | `*` | Chargebee billing |
| `google/apiclient` | `^2.19` | Google APIs (Drive, Calendar, etc.) |
| `pdfcrowd/pdfcrowd` | `^6.5` | HTML-to-PDF via pdfcrowd service |
| `smalot/pdfparser` | `^2.8` | PDF text extraction |
| `zircote/swagger-php` | `^5.5` | API documentation generation |
| `mjphaynes/php-resque` | `dev-master` | Redis job queue (background processing) |
| `sunra/dbug` | `^0.2.1` | Debug utility |
| `econea/nusoap` | `^0.9.11` | SOAP client (legacy integrations) |
| `larapack/dd` | `1.*` | Debug dump helper |
| `symfony/error-handler` | `^5.4` | Error handling |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `phpunit/phpunit ^9.6` | Unit testing |

### Autoload (PSR-4)

```json
{
  "Automation\\": "Resque/Job/",
  "models\\": "models/",
  "tasks\\": "tasks/"
}
```

### Post-install/update Scripts

```
php -d xdebug.mode=off scripts/install-tcpdf-fonts.php
```
Syncs custom TCPDF fonts from `resources/fonts/` → `vendor/tecnickcom/tcpdf/fonts/` (idempotent, checks mtime).

---

## 10. Node / Test Dependencies (`package.json`)

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@playwright/test` | `^1.58.1` | Playwright E2E testing |
| `playwright` | `^1.58.1` | Browser automation |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `@faker-js/faker ^9.6.0` | Fake data generation for tests |
| `allure ^3.1.0` | Test reporting |
| `allure-playwright ^3.4.5` | Allure + Playwright bridge |
| `cypress-downloadfile ^1.2.4` | File download testing |
| `cypress-file-upload ^5.0.8` | File upload testing |
| `dotenv ^16.4.7` | Load `.env` in test scripts |
| `fs-extra ^11.3.0` | Extended file system utilities |
| `node-fetch ^2.7.0` | HTTP requests in tests |
| `pdf-parse ^1.1.1` | Parse PDFs in test assertions |
| `ts-node ^10.9.2` | TypeScript execution |
| `typescript ^5.8.3` | TypeScript |

### NPM Scripts

| Script | Command |
|---|---|
| `cy:open-e2e` | `cypress open --e2e --browser chrome` |
| `cy:run-e2e` | `cypress run --e2e --browser chrome --record` |
| `cy:run-unit` | `cypress run --component --browser chrome --record` |

### Dependency Overrides

Security/compatibility overrides enforced via both `overrides` and `pnpm.overrides`:
- `underscore >=1.13.8`
- `handlebars >=4.7.9`
- `lodash >=4.18.1`
- `fast-xml-parser >=5.5.6`
- `brace-expansion >=5.0.5`
- `yaml >=2.8.3`

### `multi-reporter-config.json`

Cypress reporter config — uses `spec` reporter only.

---

## 11. Scripts Directory

The `scripts/` directory contains developer utilities. These are **not production code** and not run by cron jobs.

### `generateModelsV2.php`

**Purpose:** Regenerates all ORM model files from the live database schema. This is what `make gen-db-models` calls inside Docker.

**Usage:**
```bash
# Full regeneration
docker exec lendingwise_app sh -c "cd /var/www/html/lendingwise/scripts && php generateModelsV2.php"

# Single table
php generateModelsV2.php -t tblFile
```

> ⚠️ Never edit files in `/models/lendingwise/db/` directly — they will be overwritten.

---

### `cmds.sh`

**Purpose:** Shell helper functions called from the Makefile. Currently contains one function:

```bash
check_docker_mysql_ready() {
    # Polls docker logs for "ready for connections" on port 3306
    # Prints dots while waiting, then success message
}
```

---

### `check-xdebug.sh`

**Purpose:** Verifies XDebug is installed and working inside the Docker container. Reports version and configuration.

**Usage:** `make check-debug`

---

### `xdebug.ini`

XDebug configuration mounted into the container:

```ini
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
xdebug.idekey=PHPSTORM
```

---

### Database Cleanup Scripts

These SQL scripts (`clean stage db.sql.txt`, `clean testing db.sql.txt`, `cv3 db cleanup.sql.txt`) are used to clean non-production databases down to a small set of test PCIDs. They systematically delete data from all related tables while respecting foreign key relationships.

**Stage DB — kept PCIDs:** 1041 (super), 3387 (miguel), 3381, 3378, 3377, 3363 (LendingWise demo), 1652 (LendingWise), 3388, 3391, 3390, 3389

**Testing DB — kept PCIDs:** 1041, 1652, 3477, 3476

> ⚠️ These scripts contain destructive SQL. Never run against production.

---

### Other Developer Scripts

| Script | Purpose |
|---|---|
| `generatePDFs.php` | Batch-generate PDFs for all lib packages (testing/QA) |
| `generatePkgUrls.php` | Generate encrypted package URLs for QA |
| `getTableFields.php` | Maps form fields to DB columns, updates `tblFormFieldsMaster` |
| `swagger.php` | Generate OpenAPI/Swagger documentation |
| `install-tcpdf-fonts.php` | Sync custom fonts to TCPDF vendor directory |
| `copyLoanPrograms.php` | Copy field settings between loan programs |
| `cleanPDFModels.php` | Clean up old PDF model files |
| `add_phpunit_docs.php` | Auto-generate docblocks for PHPUnit test files |
| `diskNotifTest.php` | Test disk space monitoring email notifications |
| `testSaveHMLOWebForm.php` | Test the HMLO web form submission flow |
| `websocket-server/websocket-server.php` | Ratchet WebSocket server implementation |

---

## 12. Tasks Directory (Cron Engine)

The `tasks/` directory contains all scheduled background jobs. Each file is a standalone PHP script that can be run from cron. All tasks follow the pattern:

```php
require 'public/includes/util.php';
$insertRecordID = cronLog::start(basename(__FILE__));
SomeClass::Run();
cronLog::end($insertRecordID, 'optional result message');
```

### Automation Tasks

| File | Class | Purpose |
|---|---|---|
| `AutomatedEmailInstant.php` | `AutomatedEmailInstant` | Fire instant automated emails |
| `AutomatedTaskInstant.php` | `AutomatedTaskInstant` | Fire instant automated tasks |
| `AutomatedWebhookInstantTask.php` | `AutomatedWebhookInstantTask` | Fire instant webhooks |
| `AutomatedRulesV2.php` | `AutomatedRulesV2` | Evaluate automation rules engine. Accepts `-l <LMRId>` to run for a single file |
| `TriggerTimeRulesV2.php` | `TriggerTimeRulesV2` | Time-based rule triggers. Queries PCs with `days_true=1` or `date_check=1` |
| `AutomatedHTMLPdf.php` | `AutomatedHTMLPdfTask` | Queue-based HTML-to-PDF generation |
| `AutomatedAssignEmployee.php` | `AutomatedAssignEmployee` | Auto-assign employees to loan files per rules |
| `automationcron.php` | `automationCron` | General automation cron controller |

---

### Email / Communication Tasks

| File | Purpose |
|---|---|
| `send_grid_cron.php` | Process outbound Sendgrid email queue |
| `send_grid_cron_bounced.php` | Sync bounced email addresses from Sendgrid |
| `send_grid_cron_unsubscribed.php` | Sync unsubscribed emails from Sendgrid |
| `my_mail_cron.php` | Send emails via TLP's own mail server |
| `send_reminder_cron.php` | Send task and billing reminder emails from queue |
| `send_reminder_task.php` | Send task reminder notifications (loops until queue empty) |
| `send_reminder_billing.php` | Send billing reminders. Accepts `-l <LBRID>` |
| `send_messages.php` | Send SMS/Twilio messages from queue |
| `automation_mails.php` | Process automation email queue |
| `send_WF_events_reminder.php` | Send workflow event reminder notifications |
| `updateScheduleMailBulk.php` | Bulk-update scheduled mail queue |
| `updatePCIDForSendGridEmailActivity.php` | Backfill PCID on Sendgrid activity records |

---

### Data Maintenance Tasks

#### `ServicingDaily.php`

**Critical daily job.** Runs loan servicing amortization calculations for all onboarded loans.

**Key behaviors:**
- Uses MySQL `GET_LOCK('servicing3_daily_lock', 0)` — non-blocking distributed lock, exits immediately if another instance is running
- Processes in configurable batches (default 100)
- Supports simulated dates via `--asof=YYYY-MM-DD` for testing
- Per-loan advisory locks via `ServicingLedger::acquireLoanLock()` to prevent interleaving with user payments
- Creates `tblServicingMortgageStatement` records for past-due periods
- Releases lock via `register_shutdown_function` on any exit

**CLI options:**

| Option | Purpose |
|---|---|
| `--asof=YYYY-MM-DD` | Simulate running on a different date |
| `--pcid=XXXX` | Process only one PC |
| `--id=XXXX` | Process only one servicing record |
| `--batch=N` | Batch size (default 100) |

**Output format:**
```
[2026-05-16 00:00:00] servicing3_daily complete | as_of=2026-05-16 | pcid=ALL | processed=1234 | failed=0
```

---

#### `ServicingLedgerReconciliation.php`

**Nightly safety net.** Compares ledger-derived period state against `tblServicingPeriods` for all loans with posted ledger entries.

- Uses `ServicingPeriodMaterializer::reconcile()` — field-by-field comparison (16 fields, 0.01 tolerance)
- Acquires non-blocking advisory lock per loan (skips locked loans)
- **Exit code 1** if any discrepancies found — signals need for investigation
- Prints full mismatch detail: `due_date`, `field`, `expected`, `actual`

---

#### `ServicingMaterializerReconciliation.php`

**Nightly safety net (second check).** Runs `ServicingPeriodMaterializer::reconcile()` independently from the ledger reconciliation.

- Same locking strategy as above
- **Exit code 1** on any discrepancy
- Complements `ServicingLedgerReconciliation.php` with a different code path

---

#### `cron_update_processing_company_file_counts.php`

Updates `files30Days` and `files90Days` on `tblProcessingCompany` for all active companies.

**Strategy:** Keyset pagination by PCID in batches of 1000. Uses `GET_LOCK` to prevent concurrent runs.

**Updates:** `files30Days`, `files90Days`, `filesCountsLastFetched`

---

#### `cron_update_processing_company_churn_risk.php`

Evaluates churn risk for all active PCs based on plan type and 30-day file count.

**Logic:** Calls `ChurnRiskEvaluator::normalizePlanTier()` and `::shouldEnableChurnRisk()`. Skips PCs with `churnRiskManualOverride=1`. Only writes when the calculated risk differs from current value.

---

#### Other Maintenance Tasks

| File | Purpose |
|---|---|
| `getFileCounts.php` | Aggregate file count metrics into data warehouse |
| `getLoginCounts.php` | Aggregate login count metrics |
| `getPCStorage.php` | Calculate storage usage per PC |
| `getAPIUsage.php` | Pull API usage stats into data warehouse (9 SQL aggregate tables). Accepts `-s N` (start days ago) and `-e N` (end days ago) |
| `custify.php` | Sync company data to Custify CRM. Disables `MAX_EXECUTION_TIME` for long reporting queries |
| `deactivatePC.php` | Process PC deactivations |
| `deletePCServices.php` | Clean up services for deactivated PCs |
| `deleteTempTable.php` | Remove expired temp tables |
| `diskMonitor.php` | Check disk space, email alerts if over `DISK_MONITOR_GB_LIMIT` (default 25GB) |
| `fetchLatestDocDate.php` | Update latest document date tracking |
| `fetch_rest_report.php` | Fetch REST reports (only runs if `CONST_RUN_REST_CRON = 'ON'`) |
| `TrinityDownloadDocs.php` | Download completed Trinity API orders |
| `generate_third_party_docs.php` | Generate third-party service documents. Accepts `-t <tID>` |
| `generate_third_party_legal_docs.php` | Poll pending legal doc generation orders (checks orders from last 6 hours with `statusDesc IN ('In Progress','Processing')`) |
| `recalcServicing.php` | Recalculate servicing data. Accepts `-f <fileID>`, `-p <PCID>`, `-s <start>`, `-e <end>` |
| `missingCurrentLoanAmount.php` | Fill in missing current loan amount values |
| `checklistDueDateReached.php` | Trigger actions when checklist items reach their due date |
| `cronBorrowerUploadDocsNotification.php` | Notify when borrowers upload documents |
| `track_doc_fax.php` | Track MetroFax delivery status |
| `track_doc_faxage.php` | Track FaxAge delivery status |
| `track_doc_vfax.php` | Track Vitelity fax delivery status |

### `getAPIUsage` SQL Subdirectory

| SQL File | Data warehouse table populated |
|---|---|
| `daily_usage.sql` | `api_daily_usage` |
| `daily_duration_by_page.sql` | `api_daily_duration_by_page` |
| `daily_errors.sql` | `api_daily_errors` |
| `daily_host.sql` | `api_daily_host` |
| `day_details.sql` | `api_day_details` |
| `day_summary.sql` | `api_day_summary` |
| `day_error_details.sql` | `api_day_error_details` |
| `endpoint_summary.sql` | `api_endpoint_summary` |
| `ip_summary.sql` | `api_ip_summary` |
| `invalid_ip_summary.sql` | `api_invalid_ip_summary` |
| `user_summary.sql` | `api_user_summary` |
| `who_by_version.sql` | `api_who_by_version` |
| `get_version.sql` | Backfills `version` column on `page_view` |

---

## 13. Migration Tasks

Migration scripts in `tasks/migration/` are **one-time data migrations** — not scheduled crons. They are run manually during or after deployments.

### Property Migration (2023)

Three scripts migrated legacy property data from flat columns on `tblFile`/`tblFilePropertyInfo` to the normalized `tblProperties` structure:

| Script | Purpose |
|---|---|
| `InitialProperty.php` | First run — migrate all loans that have `propertyAddress` but no `tblProperties` record |
| `MultiProperty.php` | Migrate secondary properties from `tblHMLOBlanketLoanOtherProps` |
| `ChangedProperty.php` | Re-migrate files that changed after the initial migration |

Each script migrates to 4 child tables: `tblProperties`, `tblPropertiesCharacteristics`, `tblPropertiesDetails`, `tblPropertiesAccess`.

---

### `HMLOLoanTermsCalculation2.php`

Recalculates `tblFileCalculatedValues` for all loan files. Used when new calculated columns are added to the schema.

- Accepts `-p <PCID>` to target a specific PC
- Without PCID, processes all files where `doRecalculate=1`
- Runs in a loop until no more eligible records

---

### `migrateHOADataFromLegacyToInProperty.php`

Migrates legacy HOA data from `tblQAInfo`/`tblIncomeInfo`/`tblFileContacts` to the new `tblPropertiesHOA` table.

**Migration logic:**
- Legacy has data AND `tblPropertiesHOA` doesn't exist → CREATE + migrate
- Legacy has data AND `tblPropertiesHOA.isHOAAvailable` is `NULL/0` → UPDATE (default record)
- Legacy has data AND `tblPropertiesHOA.isHOAAvailable = 1` → SKIP (user set it intentionally)
- No legacy data → SKIP

**CLI options:**

| Option | Purpose |
|---|---|
| `--execute` | Actually write changes (default: dry-run) |
| `--pcid=XXXX` | Target a single PC |
| `--lmrid=XXXX` | Target a single loan file |
| `--batch-size=500` | Files per batch (default: 500) |
| `--last-lmrid=XXXX` | Resume from this LMRId |
| `--exclude-pcids=X,Y,Z` | Skip these PCIDs |

**Resume support:** Writes a checkpoint file with the last processed LMRId on every batch. Pass `--last-lmrid=<N>` to resume.

---

### `migrateHOAFieldVisibility.php`

Migrates `tblFieldsQuickApp` visibility settings from legacy HOA section fields to in-property HOA fields.

**Modes:**

| Mode | Command | Effect |
|---|---|---|
| Migrate | `--execute` | Copy FA/QA/BO display settings from legacy to in-property (1:1 mapped fields) |
| Hide legacy | `--execute --hide-legacy` | After migrating, also zero out legacy HOA display settings |
| Rollback | `--execute --rollback` | Copy in-property settings back to legacy fields |
| Hide legacy only | `--execute --hide-legacy-only` | For PCs already migrated, hide legacy fields. Optionally backs up with `--backup-table=name` |

**Field mapping (legacy → in-property):** 30+ fields mapped 1:1, including both primary HOA and secondary HOA fields.

---

### `updateTblFileCalculatedValues.php`

Fills `tblFileCalculatedValues` records for files where they're missing.

**CLI options:**

| Option | Purpose |
|---|---|
| `-p <PCID>` | Target a single PC |
| `-o <file>` | Output file for processed LMRIds |
| `-c <file>` | Checkpoint file path |
| `-r` | Resume from checkpoint |
| `-s <LMRId>` | Start from a specific LMRId (descending cursor) |
| `-L <N>` | Stop after N rows this run |
| `-x <file>` | Stop gracefully if this file exists |

Processes in descending LMRId order, batch size 5000, writes checkpoint every 100 rows.

---

### `saveRules.php`

Saves automation rule definitions from PHP class files to the database. The `CRB` and `LendingWise` classes in `tasks/migration/rules/` define rules as PHP arrays; this script persists them to `tblAutomatedRuleSetV2`.

---

### `CBMigration2.php`

Migrates Chargebee customer IDs. Finds all active PCs with `subscriberID` starting with `cb_` and no `customerID`, queries Chargebee's API to get the customer ID from the subscription, and saves it to `tblProcessingCompany.customerID`.

**Prompts for confirmation before writing.**

---

## 14. Deployment Process — End to End

### Phase 1: Local Development

```
Developer/PO runs: make setup-local

1. preflight
   ├── Check ../api exists AND is on branch release_v3.2
   ├── Check ../upload exists
   └── Create ../data_lendingwise if missing (chmod 777)

2. install-git-hooks
   ├── git config core.hooksPath .githooks
   └── chmod +x .githooks/*

3. create-env-file
   ├── cp .env.default → .env (OUTPUT_ERRORS set to 1)
   └── cp ../api/.env.sample → ../api/.env (backs up existing)

4. create-temp-folder
   └── mkdir -p public/temp (777)

5. remove-composer-lock
   └── rm -f composer.lock

6. up
   ├── docker compose up -d
   └── api-secret: generates MASTER_SECRET_KEY in ../apilocal.lendingwise.com.php

7. gen-db-models
   ├── composer install (lendingwise, api, upload)
   ├── Wait for MySQL health check
   ├── php scripts/generateModelsV2.php
   └── bash api/tasks/generateModels.local.sh
```

**Access after setup:**
- App: `http://local.lendingwise.com/`
- API: `http://apilocal.lendingwise.com/`
- Upload: `http://uploadlocal.lendingwise.com/`
- Login: `dave@lendingwise.com` / `simple`

---

### Phase 2: Feature Development Workflow

```
1. Identify developer
   → git config user.name → match to team registry in CLAUDE.md

2. Get ClickUp task
   → Paste ClickUp URL or branch name

3. Create branch
   → claude/CU-[ticketid]_[Description]_[GitHubUsername]

4. Read AGENTS.md
   → Route to correct skill file in /docs/DEV/ai-skills/

5. Write code
   → Follow security rules (PCID scoping, ORM, no raw SQL)
   → Follow reuse-first mandate
   → Follow PHP standards (PSR-12, type hints, strict_types)

6. Run tests locally
   → make test-phpunit-docker

7. Commit
   → [CU-abc123] Description of change
   → ai: claude-code | owner: [username]

8. Open PR
   → Title: [CU-868j1jdub] Feature description (Name)
   → Tag SR Dev reviewer
   → Link ClickUp task

9. (Optional) Run skill file audit on same branch before merge
```

---

### Phase 3: CI/CD — Dev and Staging (Automatic)

```
Push to develop or master branch triggers ci_cd_dev_staging.yml

Job 1: build_deploy
  ├── Determine AWS account from branch
  │   ├── develop → Dev account (757278011057)
  │   └── master  → Staging account (020359319387)
  ├── docker compose up -d
  ├── phpunit (XDEBUG_MODE=off)
  ├── docker build → tag with git hash + :latest/:dev-latest
  ├── docker push → ECR (685551735768.dkr.ecr.us-east-2.amazonaws.com/lendingwise-legacy)
  ├── aws ecs update-service --force-new-deployment
  │   Cluster: lendingwise-legacy
  │   Service: lendingwise-service
  └── Notify ClickUp

Job 2: post-deploy-testing  [needs: build_deploy]
  Matrix: 10 parallel runners, fail-fast: false
  ├── Sleep 120s (wait for ECS rollout)
  ├── Verify /version.json contains expected git hash
  ├── Run Cypress E2E (.github/test.sh)
  └── Notify ClickUp (pass/fail)
```

---

### Phase 4: Production Deploy (Manual)

```
Manual trigger: workflow_dispatch on prod_deploy.yml
Input: action = "deploy" | "scaleback"

Job: deploy
  ├── Assume Staging role (020359319387)
  ├── Get current Staging ECS task definition
  ├── Extract container image URL from task def
  │   (or use provided image_id input)
  ├── Assume Prod role (098824477113)
  ├── jq-patch task definition with Staging image
  ├── Ensure RDS ≥ db.t3.medium (upsize if needed)
  ├── Ensure ECS desired count ≥ 1
  ├── Wait for tasks-running state
  └── Notify ClickUp

Key principle: Prod ALWAYS runs the image already on Staging.
              No rebuild. Promote, don't rebuild.

Job: scaleback (independent)
  ├── Assume Prod role
  ├── Scale ECS desired count = 0
  ├── Resize RDS to db.t3.micro
  └── Notify ClickUp (direct curl)

⚠️ Bug: Blank action input runs both jobs simultaneously.
         Always specify action explicitly.
```

---

### Deployment Flow Summary Diagram

```
Developer Machine
    │
    ├── make setup-local
    ├── write code + tests
    └── git push to develop/master
              │
              ▼
    GitHub Actions (ci_cd_dev_staging.yml)
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
  develop            master
 (Dev AWS)        (Staging AWS)
    │                    │
    ▼                    ▼
  ECR image         ECR image
  Dev ECS deploy    Staging ECS deploy
    │                    │
    └──── Cypress E2E ───┘
                │
                ▼ (manual trigger)
    GitHub Actions (prod_deploy.yml)
                │
                ▼
    Pull Staging image → Deploy to Prod ECS
    (Prod account: 098824477113)
```

---

## 15. AWS Account Structure

| Environment | AWS Account ID | Trigger | ECS Cluster | Notes |
|---|---|---|---|---|
| Dev | `757278011057` | Push to `develop` | `lendingwise-legacy` | Auto-deploy |
| Staging | `020359319387` | Push to `master` | `lendingwise-legacy` | Auto-deploy + Cypress E2E |
| Production | `098824477113` | Manual `workflow_dispatch` | `lendingwise-legacy` | Promote from Staging only |
| ECR Registry | `685551735768` | Shared | N/A | All environments pull from here |

**ECR URI:** `685551735768.dkr.ecr.us-east-2.amazonaws.com/lendingwise-legacy`

**Image tags:**
- `:{git-hash}` — immutable, per-commit
- `:latest` — current Staging
- `:dev-latest` — current Dev

**RDS sizing:**
- Staging/normal: `db.t3.micro`
- During production deploy: upsized to `db.t3.medium` (auto)
- After scaleback: returns to `db.t3.micro`

---

## 16. Multi-Tenant Architecture Reference

| Identifier | Table | Meaning |
|---|---|---|
| `PCID` | `tblProcessingCompany` | Processing Company ID — primary tenant identifier |
| `FPCID` | `tblFile.FPCID` | File Processing Company ID — ties loan file to tenant |
| `FBRID` | `tblFile.FBRID` | File Branch/Executive ID — branch-level scoping |
| `LMRId` | `tblFile.LMRId` | Loan File ID — primary key of the loan file |
| `CID` | `tblClient.CID` | Client/Borrower ID |

**Every tenant-scoped query must filter by PCID or FPCID.** Failing to do so is a P0 blocker in code review.

**User portal routing** by `$userGroup`:

| Group | Portal |
|---|---|
| `Super` | Super admin |
| `Sales` | Sales portal |
| `Employee` | Back office |
| `Branch` | Branch executive |
| `Agent` | Agent portal |
| `Client` | Borrower portal |
| `Broker` | Broker portal |
| `Loan Officer` | Loan officer portal |

---

## 17. Multi-Database Structure Reference

| Constant | Database Name | Purpose |
|---|---|---|
| `DB_NAME` | `lendingwise` (prod) | Core application data — loans, borrowers, workflows, all main tables |
| `DATA_LW_API` | `lendingwise_api` | API users, sessions, tokens, page views, API error logs |
| `DATA_LW_LOG` | `lendingwise_log` | Audit logs, change log, field history (the `change_log` table) |
| `DATA_LW_FCI` | `lendingwise_fci` | FCI (First Capital Inc) integration data |
| `DATA_LW_CHARGEBEE` | `lendingwise_chargebee` | Billing and subscription data from Chargebee |
| `DATA_LW_DATAWAREHOUSE` | `lendingwise_datawarehouse` | Analytics and reporting aggregates (API usage, file counts, login counts) |

---

**Last Updated:** 2026-05-16 (Full 31-file repo audit — initial documentation pass)
**Owner:** Engineering Team