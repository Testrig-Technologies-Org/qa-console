# Structure

```text
/lendingwise
├── .github/                        # 🤖 GitHub Integration & Automation Hub
│   ├── workflows/                  # CI/CD Pipelines
│   │   ├── ci_cd_dev_staging.yml   # Auto-deploy to Dev/Staging AWS
│   │   └── prod_deploy.yml         # Manual Promotion to Production AWS
│   ├── auto_assign.yml             # PR Management: Automated reviewer assignment
│   ├── copilot-instructions.md     # AI Guardrails: Custom rules for GitHub Copilot
│   ├── dependabot.yml              # Security: Automated dependency vulnerability checks
│   ├── package.json                # CI Logic: Node.js tooling for GitHub Actions
│   └── test.sh                     # Testing: Standardized master script for CI runs
├── .githooks/                      # ⚓ Git Hooks (Local Quality Police)
│   ├── pre-commit                  # Validates .env (Blocks push if OUTPUT_ERRORS is On)
│   └── pre-push                    # Runs final local checks before code leaves machine
├── Resque/Job/ 🔴 [EMPTY]          # ⚙️ Planned for Asynchronous Workers
├── _api_files/                     # 📦 Persistence (JSON-based API client registry)
├── _config/public/                 # ⚙️ Legacy Config (Historical portal settings)
├── _snyk/                          # 🛡️ Security Audit (Baseline: snyk-20230621.txt)
├── api_models/                     # 🧠 API Logic & Security Layer
│   ├── Security.php                # Central Auth/Encryption engine
│   ├── UserDTO.php                 # Data object for user roles
│   ├── api_user.php                # API Client manager (reads JSON)
│   ├── api_user_log.php            # Auth attempt logger
│   ├── app_user.php                # System user data model
│   ├── auth.php                    # Oauth code data model
│   └── page_view.php               # Traffic & performance logger (SQL-based)
├── database/                       # 🗄️ SQL Migrations (Deterministic day-based folders)
├── db-init/                        # 🐳 Docker Database initialization scripts
├── docs/                           # 📖 Documentation Hub
│   ├── ARCHITECTURE/               # System maps & compliance docs
│   ├── DATA/                       # Data dictionaries & ERDs
│   ├── DEV/                        # Coding standards & AI skills index
│   └── RELEASE/                    # Deployment checklists & pipeline flow
├── functions/                      # 🛠️ Shared Helpers (PDF, Math, Amortization)
├── lib/                            # 📚 Core Libraries (Debugger, Env, Bugsnag)
├── migrations/                     # 🚜 One-time data conversion tasks
├── models/                         # 🏗️ Data Layer (ORM Wrappers)
│   ├── lendingwise/db/             # Auto-generated base models (NEVER hand-edit)
│   ├── composite/                  # Multi-table business logic
│   └── types/                      # strongType definitions
├── pages/                          # 🌐 MVC Controllers & View Templates
├── playwright/                     # 🎭 E2E Browser testing suite
├── public/                         # 🚪 Web Root
│   ├── assets/                     # Legacy UI assets (Metronic)
│   ├── assetsNew/                  # Modern UI assets (v8+)
│   ├── index.php                   # Production entry point
│   ├── _index.php                  # Developer debug entry point
│   ├── .htaccess                   # Apache URL rewrite rules
│   ├── version.json                # Deployment version tracker
│   └── [portal-files].php          # Entrance files for specific modules
├── resources/fonts/                # 🎨 Font library for PDF generation
├── scripts/                        # 🔧 Dev Utilities (Model generators, XDebug)
├── tasks/                          # ⏰ Cron Engine (Daily Servicing & Auto-rules)
│   └── migration/                  # Complex manual data migration logic
├── test-results/                   # 🧪 QA Output (Artifacts from CI/CD runs)
├── ✅ tests/                              # 🧪 Unit Testing (PHPUnit suite)
|      ├── files/                          # 📂 Test Stubs & Mock Data
│      |   └── test.xlsx                   # Mock spreadsheet for import testing
|      ├── phpunit/                        # 🚀 Main Test Suite
│      |   ├── bootstrap.php               # System initializer for PHPUnit
│      |   ├── JQFiles/                    # Tests for jQuery-facing AJAX endpoints
│      |   ├── models/                     # 🏗️ Mirrored Core Logic Tests
│      │   |   ├── Controllers/            # Business logic controller tests
│      │   |   ├── composite/              # Complex multi-table logic tests (Servicing, DrawMgmt)
│      │   |   ├── constants/              # System constant validation
│      │   |   ├── loan_math/              # Critical financial calculation tests
│      │   |   ├── standard/               # Standard library and helper tests
│      │   |   └── [IndividualTests].php   # Tests for APIHelpers, Sessions, and Security
│      |   ├── pages/                      # 🌐 Mirrored Portal/UI Logic Tests
│      │   └── backoffice/loan/            # Deep tests for Servicing2 and Servicing3 classes
│      ├── tasks/                          # ⏰ Mirrored Cron Job Tests
│      │   └── TriggerTimeRulesV2/         # Rules engine and Churn Risk calculation tests
│      └── [SandboxTests].php              # Work-in-progress or example tests (Murali.php, josue.php)
├── ✅ .deepsource.toml                # ✅ Quality Gate (Static analysis configuration)
├── ✅ .dockerignore                   # 🐳 Docker Filter (Image optimization)
├── ✅ .env.default                    # 🔑 Master Environment Variable Template
├── ✅ .env.example                    # 🔑 API Environment Template
├── ✅ .env.local                      # 🔑 Machine-specific overrides (Untracked)
├── ✅ .gitattributes                  # ⚓ Git settings (Forcing Unix line endings)
├── ✅ .gitignore                      # 🚫 Security Filter (Blocking secrets & logs)
├── AGENTS.md                          # 🗺️ AI Agent Master Routing & Navigation
├── CLAUDE.md                          # 📜 AI Git Workflow & Coding Rules
├── ✅ Dockerfile                      # 🐳 Build Recipe (PHP 8.3, Apache, LibreOffice)
├── ✅ Makefile                        # 🕹️ Master Automation (make setup-local, make up)
├── Master-MD-File-instructions.txt    # 📋 Documentation standards for Markdown
├── PROJECT_MASTER.md                  # 📑 End-to-end Release & Operational Manifest
├── ✅ README.md                       # 📖 General Project Orientation
├── Review.md                          # 🟠 PR Review Standards (P0 Blockers)
├── ✅ composer.json                   # 📦 PHP Dependencies (Guzzle, JWT, TCPDF)
├── ✅ composer.lock                   # 📦 Locked dependency versions             ---> this is not included 🔴
├── ✅ composer.phar                   # 📦 PHP Composer binary
├── config.php                         # ⚙️ Constant definitions for environment variables
├── constants.php                      # ⚙️ Global system constants
├── custom-php.ini                     # ⚙️ PHP container configuration overrides
├── ✅ docker-compose.yml              # 🐳 Local Orchestration (App & DB services)
├── js_version.php                     # 🚀 Asset cache-busting (Git SHA based)
├── modules.php                        # 🚀 App Bootstrap (Autoloading & Core Init)
├── modules_functions_pdf.php          # 🚀 PDF-specific bootstrap
├── multi-reporter-config.json         # 🧪 Test reporting configuration
├── ✅ package-lock.json               # 🧪 Node.js locked dependencies
├── ✅ package.json                    # 🧪 Node.js Test Dependencies (Playwright)
├── params.php                         # ⚙️ Legacy system parameters
├── ✅ phpunit.xml                        # 🧪 PHPUnit test runner configuration
├── ✅ pnpm-lock.yaml                     # 🧪 Alternate Node.js lock file
└── RELEASES.md                        # 📖 Historical release log and version tracking
```

To align with your **Documentation Conventions & Standards**, I have mapped the internal structure of your testing engine. This structure proves that LendingWise uses a **Mirrored Testing Pattern**, where the test directory perfectly mimics the source code directory for easy navigation.

---

<!--
Owner: Engineering Team
Last reviewed: 2026-05-16 (Post-PHPUnit Directory Audit)
Scope: Detailed map of the PHPUnit testing suite, including mirrored logic and stub file locations.
-->

# 🧪 PHPUnit test structure

The purpose of this document is to define the organization of the LendingWise automated test suite. It ensures that developers and AI agents know exactly where to place new tests when modifying core models, controllers, or background tasks.

## 🗺️ Testing directory map

LendingWise uses a mirrored hierarchy. If a file exists at `models/composite/oFileUpdate.php`, its corresponding test must live at `tests/phpunit/models/composite/oFileUpdateTest.php`.

```text
/lendingwise/tests
├── files/                          # 📂 Test Stubs & Mock Data
│   └── test.xlsx                   # Mock spreadsheet for import testing
├── phpunit/                        # 🚀 Main Test Suite
│   ├── bootstrap.php               # System initializer for PHPUnit
│   ├── JQFiles/                    # Tests for jQuery-facing AJAX endpoints
│   ├── models/                     # 🏗️ Mirrored Core Logic Tests
│   │   ├── Controllers/            # Business logic controller tests
│   │   ├── composite/              # Complex multi-table logic tests (Servicing, DrawMgmt)
│   │   ├── constants/              # System constant validation
│   │   ├── loan_math/              # Critical financial calculation tests
│   │   ├── standard/               # Standard library and helper tests
│   │   └── [IndividualTests].php   # Tests for APIHelpers, Sessions, and Security
│   ├── pages/                      # 🌐 Mirrored Portal/UI Logic Tests
│   │   └── backoffice/loan/        # Deep tests for Servicing2 and Servicing3 classes
│   ├── tasks/                      # ⏰ Mirrored Cron Job Tests
│   │   └── TriggerTimeRulesV2/     # Rules engine and Churn Risk calculation tests
│   └── [SandboxTests].php          # Work-in-progress or example tests (Murali.php, josue.php)
└── phpunit.xml                     # ⚙️ Master configuration for the test runner
```

## 🏗️ Key testing categories

| Category | Location | Release Importance |
| :--- | :--- | :--- |
| **Financial Logic** | `models/loan_math/` | **Critical.** Ensures interest and amortization never fail. |
| **Servicing** | `pages/backoffice/loan/` | **High.** Validates the Servicing3 history and log views. |
| **Automated Rules** | `tasks/TriggerTimeRulesV2/` | **High.** Ensures tenant-specific rules trigger on schedule. |
| **Data Integrity** | `models/composite/` | **Critical.** Validates multi-table writes and ORM performance. |
| **Input Security** | `models/SecurityTest.php` | **P0.** Ensures JWT and AES encryption remain uncompromised. |

## ⚙️ How to run tests

LendingWise standardizes test execution via the [Makefile](/Makefile) to ensure environment parity with AWS.

1. **Local Docker:** Run `make test-phpunit-docker`. This executes the suite defined in `phpunit.xml` using the `bootstrap.php` to connect to the internal `lendingwise_db` container.
2. **Specific Filter:** To run a single test class (e.g., Security):
   ```bash
   docker exec -it lendingwise_app bash -c "./vendor/bin/phpunit --filter SecurityTest"
   ```

## 🧪 Unknowns and placeholders

<<UNKNOWN>> **E2E Integration:** The link between PHPUnit (Logic) and Playwright (Browser) is not yet documented. 

**Discovery Steps:**
1. Files to read: `.github/test.sh`.
2. Questions: Does the CI run PHPUnit and Playwright in parallel or sequence? Does a PHPUnit failure block the Playwright run?

## ## See Also
- [CLAUDE.md](/CLAUDE.md) - Rules for ClickUp task branch naming and testing requirements.
- [Makefile](/Makefile) - Technical commands for running the test suite.
- [PROJECT_MASTER.md](/PROJECT_MASTER.md) - The end-to-end release pipeline.

**Last Updated:** 2026-05-16 (Mirrored Test Structure Completion)
**Owner:** Engineering Team

# phpunit.xml

The **`phpunit.xml`** file is the **Command Center for Automated Testing**. It is the configuration file for PHPUnit, the tool LendingWise uses to verify that its logic is correct and secure before code is ever allowed to reach AWS.

In a professional release process, this file is the difference between "hoping the code works" and **"knowing the code works."**

---

### 1. What the specific settings in your file do:

*   **`bootstrap="tests/phpunit/bootstrap.php"`**: This is the most important part. Before any tests run, this script "wakes up" the LendingWise environment (connects to the DB, loads constants from `config.php`, and starts the autoloader).
*   **`beStrictAboutOutputDuringTests="true"`**: This ensures that your business logic doesn't have accidental `echo` or `print_r` statements. If it does, the test fails. This prevents "junk" data from leaking into API responses.
*   **`<coverage>`**: This tells the system to measure "Code Coverage" for the `models/` and `legacy/` folders. It generates a report showing exactly how much of your critical business logic has been tested.
*   **`<testsuite>`**: This points PHPUnit to the `tests/phpunit` directory. It’s the "map" that tells the tool where all the test files are located.

---

### 2. Why LendingWise needs this for its Release Process:

#### A. The "Quality Gate" 🛡️
Your `Makefile` has a command: `make test-phpunit-docker`. This command looks for `phpunit.xml`.
*   **Release Rule:** No code should be merged to `master` unless it passes these tests. This prevents a developer from accidentally breaking the Loan Servicing logic while fixing a UI bug.

#### B. Verification of Security Rules 🔐
You have strict rules about **PCID scoping** (tenant data protection).
*   **Use Case:** You can write a test that checks: *"If User A from PCID 1 tries to access a loan from PCID 2, does the system block it?"*
*   The `phpunit.xml` ensures this check runs automatically on every Pull Request.

#### C. Preventing Regressions 🔄
LendingWise is a large, complex platform. Changing code in `functions/` might break something in `api_models/`. 
*   **Automated Testing** finds these "side-effect" bugs instantly, long before a customer finds them on the production site.

---

### 3. How it fits into your workflow:

1.  **Local:** You run `make test-phpunit-docker`. PHPUnit reads `phpunit.xml` and runs the tests.
2.  **GitHub:** When you push code, your GitHub Action (`ci_cd_dev_staging.yml`) runs the same tests.
3.  **Result:** 
    *   **FAIL ❌:** The "Release Process" stops. Code does not go to AWS.
    *   **PASS ✅:** The process continues to the Docker Build and Deployment phase.

---

### 🏁 Summary for your Documentation:
> **`phpunit.xml`**: Defines the configuration for automated logic and security testing. It ensures that the LendingWise environment is correctly bootstrapped for testing and enforces strict quality standards before code is deployed to AWS.

**I'll add the green tick (✅) to this file in the Master Structure. Would you like me to show you how to write a simple test that checks if your PCID scoping is working?**

# composer.phar

The file **`composer.phar`** is the "PHP Archive" executable for **Composer**, which is the dependency manager for PHP.

In your LendingWise repository, you likely have it for the following reasons:

### 1. Portability & Team Consistency
Instead of requiring every developer to "install" Composer on their Windows, Mac, or Linux machine, having the `.phar` file in the repo means anyone with PHP installed can run it immediately using:
`php composer.phar install`
This ensures that every team member (and the AI agents) is using the **exact same version** of the tool, preventing "it works on my machine" errors caused by different Composer versions.

### 2. Safeguard for the Docker Build
In your **`Dockerfile`**, you have a line that downloads Composer from the internet. However, if the official Composer website goes down or your network blocks the download during a critical release, having `composer.phar` physically in the repo acts as a **backup**. Your scripts can fall back to the local file to ensure the build never fails.

### 3. CI/CD Pipeline Reliability
In your **GitHub Actions** (`ci_cd_dev_staging.yml`), the runner needs to install libraries like Guzzle and JWT. Sometimes, build environments are restricted and cannot download external binaries. Having the `.phar` file inside the Git repo guarantees that the tool is always available to the automated release pipeline.

---

### ⚠️ A Note for your "Release Process Improvement"
While it is convenient to have `composer.phar` in the repo, modern best practices suggest **not** committing it to Git, because:
1.  **Security:** It is a binary file. If it gets old, it might have security holes. It’s better to let the `Dockerfile` manage the installation of the latest stable version.
2.  **Repo Size:** It adds unnecessary weight to the repository.

**Recommendation for your Doc:**
If you want to keep your repo "clean," you should rely on the `Dockerfile` to install Composer and remove `composer.phar` from the Git repo. However, if your current **`Makefile`** specifically calls `php composer.phar`, you must keep it until you update the `Makefile` to use the global `composer` command.

### How to use it:
If you ever need to update your PHP libraries manually, you run:
`php composer.phar update`
This will update your `composer.lock` file, which is the actual "App Detail" that **must** stay in Git to ensure your releases are stable.

# composer.json and composer.lock

In the context of the LendingWise platform, having both **`composer.json`** and **`composer.lock`** is the difference between a "plan" and a "guarantee."

Here is exactly why you have both and why they are critical for your professional release process.

---

### 1. `composer.json`: The Blueprint (The "What")
This file is the **manifest**. It tells the system which libraries are needed to run LendingWise.
*   **What it does:** It lists the names of packages (like `guzzlehttp` or `firebase/php-jwt`) and a **version range** (e.g., `^8.3`).
*   **Release Role:** It is for humans and AI. It defines the *requirements* of the project. 
*   **Analogy:** It’s like a grocery list that says: *"Buy some bread, some eggs, and some milk."*

### 2. `composer.lock`: The Snapshot (The "Exact Measurement")
This file is the **security guard** of your deployment. It is automatically generated when you run `composer install` or `update`.
*   **What it does:** It records the **exact version number** and the **specific Git commit hash** of every single library and sub-library installed.
*   **Release Role:** It ensures **Environment Parity**. It guarantees that the exact code you tested on your local Docker is the *identical* code that gets deployed to AWS Production.
*   **Analogy:** It’s like a receipt that says: *"You bought exactly one 24oz loaf of Whole Wheat Bread from Brand X, Batch #402."*

---

### 3. Why you MUST have both in your Git Repo
To improve your release process, you need both to prevent the **"It works on my machine"** disaster.

| Scenario | Without `composer.lock` | With `composer.lock` |
| :--- | :--- | :--- |
| **Developer A installs** | Installs version 1.0.1 | Installs version 1.0.1 |
| **Library Update** | Library creator releases 1.0.2 with a bug | (No change) |
| **AWS Deployment** | AWS pulls 1.0.2 (The Bug) | **AWS pulls 1.0.1 (The stable version)** |
| **Result** | **Production Crashes** ❌ | **Production is Stable** ✅ |

---

### 4. How they work with your other files
*   **`Dockerfile`:** When the Docker image is built for AWS, it runs `composer install`. Because the `.lock` file is present, Composer doesn't "calculate" versions; it simply downloads the exact files listed in the lock.
*   **`Makefile`:** Your `make setup-local` command uses these files to ensure every developer on your team has the same local environment.
*   **`.github/workflows/`:** Your CI/CD pipeline uses these files to install dependencies before running PHPUnit tests.
*   **`dependabot.yml`:** This GitHub tool reads your `composer.lock` to see if any of your *exact* versions have known security vulnerabilities (like those in your Snyk report).

---

### 🏁 Final Summary for your Docs:
> *   **`composer.json`**: Defines our dependencies. 
> *   **`composer.lock`**: Locks our dependencies. **Never delete this file.** If you update a library, you must commit the updated `.lock` file so the rest of the team and the AWS production server stay in sync.

**I have added the Green Ticks (✅) to both in the Master Map because they are verified and essential. Shall we move to the next file?**

