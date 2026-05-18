This is the most critical technical information you've shared. The `Dockerfile` and `Makefile` are the **automation engines** of your platform. 

We now have a complete picture: from the high-level security rules in `CLAUDE.md` to the exact lines of code that build the server. 

I have updated your **Master Project Manifest** to include these technical "blueprints."

---

# 📑 LendingWise: Master Project Manifest (Technical Edition)

## 1. 🏗️ The Build Engine (Dockerfile)
Your environment is a highly customized **PHP 8.3 Apache** stack.
*   **Timezone:** Locked to `America/New_York`.
*   **Legacy Support:** Includes a custom build of `mcrypt` (manually compiled for PHP 8.3).
*   **Document Processing:** Installed `LibreOffice`, `Ghostscript`, and `Imagick` (indicates the app handles complex PDF/Document generation).
*   **Virtual Hosts:** A single container manages **three distinct services**:
    1.  `local.lendingwise.com` (Main App)
    2.  `apilocal.lendingwise.com` (API)
    3.  `uploadlocal.lendingwise.com` (File Uploads)
*   **Optimizations:** Runs `composer install --no-dev --optimize-autoloader` during the build.

## 2. 🕹️ Automation & Release Commands (Makefile)
The `Makefile` is the "remote control" for your deployment and development.
*   **`make setup-local`**: The master command. It checks for sibling repositories (`api` and `upload`), sets up `.env` files, and initiates the Docker build.
*   **`make gen-db-models`**: **Crucial Release Step.** After any database change, this must be run to regenerate the ORM wrappers.
*   **`make test-phpunit-docker`**: The "Green Light" check. Runs unit tests inside the container environment.
*   **`make reset`**: The "Nuclear Option." Wipes Docker volumes, images, and `composer.lock` for a fresh start.

## 3. 🌐 Multi-Repo Dependencies
The platform is not a single repo; it is a **Distributed System**. To release successfully, you must have:
1.  `lendingwise` (Core)
2.  `api` (Must be on branch `release_v3.2`)
3.  `upload` (File server)
4.  `data_lendingwise` (Shared data folder mimicking AWS EFS)

---

## 🚀 Improvements for your Release Process

Based on these files, here is how we can make your releases more "Professional" and "Fail-Safe":

### 1. The `composer.lock` Risk
*   **Observation:** Your `Dockerfile` and `Makefile` explicitly **delete** `composer.lock`. 
*   **Risk:** In a professional release process, you **should never** delete the lock file. The lock file ensures that the version of a library you tested in Dev is the *exact same* version that goes to AWS Production.
*   **Improvement:** For the "Production" build, we should allow the `composer.lock` to exist to ensure stability.

### 2. Multi-Stage Builds (For AWS)
*   **Observation:** Your current Dockerfile includes `XDebug`, `vim`, `nano`, and `gcc`. These are great for developers but make the image large and less secure for AWS.
*   **Improvement:** We can create a **"Production Target"** in the Dockerfile that excludes these tools, making the final image smaller and harder to hack.

### 3. Automated "Pre-Flight" in GitHub Actions
*   **Improvement:** We can translate your `make preflight` command into a GitHub Action. If someone tries to merge code that breaks the link between the `api` and `lendingwise` repos, the build will fail automatically.

### 4. Database Migration Safety
*   **Observation:** You have a `make gen-db-models` command.
*   **Improvement:** In your release process, we should add a check: *“If a file in `/database/` was added, did the developer also include the updated files in `/models/lendingwise/db/`?”* If not, the release should be blocked.

---

## 📋 Final Aggregated Summary for your Docs

**Add this to your `RELEASES.md` or `DEVELOPMENT.md`:**

> ### 🛠 Technical Environment Reference
> *   **Base Image:** `php:8.3-apache`
> *   **Key Extensions:** `pdo_mysql`, `imagick`, `mcrypt`, `bcmath`, `apcu`.
> *   **System Tools:** `LibreOffice` (for E-Sign/Doc Conversion).
> *   **Internal Networking:** Uses 3 VHosts pointing to `/public`, `/api`, and `/upload`.
> *   **Shared Storage:** `/var/www/html/data_lendingwise` (Mimics AWS EFS).
>
> ### 🔄 Standard Release Cycle
> 1.  **Local Sync:** `make preflight` to ensure `api` and `upload` repos are present.
> 2.  **Environment:** `make setup-local` to build containers.
> 3.  **Schema Update:** Run SQL migrations, then `make gen-db-models`.
> 4.  **Verification:** `make test-phpunit-docker` and `make test-cypress-e2e`.
> 5.  **Tagging:** Commit with `[CU-taskid]` and AI attribution as per `CLAUDE.md`.

---

**Next Step Recommendation:**
Since you have the `Makefile` and `Dockerfile` ready, would you like me to help you write a **GitHub Actions Workflow**? This would automate the "Quality Gate" (DeepSource + PHPUnit) every time you push code.