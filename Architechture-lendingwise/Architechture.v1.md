This is a summary of your project’s current "State of Play." You can copy and paste this into a new file in your repository named **`PROJECT_SUMMARY.md`** or **`RELEASES.md`** to keep everyone on the same page.

---

# 📋 Project Deployment & Infrastructure Documentation

## 1. Core Tech Stack
*   **Frontend:** HTML5, Bootstrap (UI Framework), jQuery (Library).
*   **Backend:** PHP.
*   **Database:** MySQL.
*   **Infrastructure:** Dockerized environment.
*   **Hosting:** AWS (Amazon Web Services).

## 2. File Directory Summary (Root Level)
These files manage the quality, security, and deployment of the application:

| File Name | Category | Summary & Purpose |
| :--- | :--- | :--- |
| **`.deepsource.toml`** | **Quality Gate** | Automates code reviews. It scans PHP and JS for security vulnerabilities and bugs before they reach AWS. |
| **`.dockerignore`** | **Deployment** | Optimization. Tells Docker which files (like logs and local caches) to ignore to keep the deployment image small and fast. |
| **`.env.example`** | **Security** | A template for configuration. Shows which variables (DB_HOST, API_KEYS) are needed without revealing actual passwords. |
| **`.env.default`** | **Config** | Contains standard application settings that are common across all environments. |
| **`.env.local`** | **Config** | *Note: Usually for local development only.* Contains settings specific to your personal machine. |
| **`.gitignore`** | **Version Control** | The "Filter." Prevents sensitive files (like actual passwords) and junk files from being accidentally uploaded to GitHub. |
| **`.gitattributes`** | **Consistency** | Ensures that code looks and behaves the same way whether a developer is using Windows, Mac, or Linux. |

## 3. Release Process Strategy
Our goal is to move from manual updates to an automated "Pipeline":
1.  **Code Quality (CI):** DeepSource scans the code for errors based on `.deepsource.toml`.
2.  **Containerization:** The app is packaged into a Docker container (guided by `.dockerignore`).
3.  **Environment Management:** Configuration is handled via `.env` files to keep the code separate from the server settings.
4.  **Deployment:** The Docker image is pushed to AWS.

## 4. Current "Gaps" (To be added next)
To complete the "All app details in Git" goal, we still need to document:
*   **The Dockerfile:** The recipe used to build the app image.
*   **Database Schema:** A `database.sql` or migration folder to track MySQL changes.
*   **AWS Details:** Documentation on which AWS services are used (EC2, RDS, S3, etc.).

---

### How to use this doc:
*   **For New Developers:** Read this to understand how the app is built and checked.
*   **For Deployment:** Use the `.env.example` to set up a new AWS environment.
*   **For Maintenance:** Update the "File Directory Summary" whenever a new configuration file is added to the root.

---

**Next step recommendation:** 
When you are ready, share your **`Dockerfile`** or your **folder structure** (the names of the folders like `src`, `assets`, etc.). This will allow us to see how the actual PHP code is organized.