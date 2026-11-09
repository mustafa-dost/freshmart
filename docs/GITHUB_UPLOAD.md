# Upload FreshMart to GitHub

This guide publishes the `freshmart` project folder as a GitHub repository. GitHub stores the source code; it does not run or host the website by itself.

## Before You Start

You need:

- A GitHub account
- Git installed on your computer
- The FreshMart project folder

Open PowerShell and change to the project folder. Update the path to match where you saved it:

```powershell
Set-Location "C:\path\to\freshmart"
```

Confirm Git is installed and inspect the repository state:

```powershell
git --version
git status --short --branch
```

If `git status` says this is not a Git repository, initialize it in this folder:

```powershell
git init -b main
```

If it is already a Git repository, do not initialize it again; continue with the existing repository.

## Protect Environment Secrets

The project ignores local environment files and allows only `.env.example` to be shared. Verify this before staging files:

```powershell
git check-ignore -v .env
git status --short
```

The first command should report `.env` as ignored. Confirm that `.env` is not already tracked:

```powershell
git ls-files .env
```

No output means `.env` is not tracked. If the command lists `.env`, stop before pushing and remove it from Git's index:

```powershell
git rm --cached .env
```

If a real secret was ever committed or pushed, removing the file is not enough: change/rotate that password, database credential, or secret immediately. Do not publish `.env`, database connection strings, JWT secrets, access tokens, or real admin credentials.

## Create an Empty GitHub Repository

1. Sign in at [github.com](https://github.com/).
2. Select **New repository**.
3. Choose a repository name such as `mustafa-dost-freshmart`.
4. Choose **Private** or **Public**. Public is fine only after confirming the repository contains no secrets or private information.
5. Do not initialize the GitHub repository with a README, license, or `.gitignore`; those files already exist in this project.
6. Create the repository and keep the page open to copy its HTTPS URL.

## Stage and Review the Project

From the `freshmart` folder, stage the files and inspect the list before committing:

```powershell
git add .
git status --short
git diff --cached --name-only
git diff --cached --check
```

Confirm that `.env`, `node_modules`, and `.next` are not staged. `.env.example` should be staged. To inspect the staged environment example:

```powershell
git diff --cached -- .env.example
```

If you see a real credential or private local path in any staged file, remove it before proceeding.

## Commit and Push

Create the first commit:

```powershell
git commit -m "Add FreshMart grocery storefront"
```

Add the HTTPS repository URL copied from GitHub. Replace the example URL with your own:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

If `origin` already exists, inspect it first:

```powershell
git remote -v
```

If it points to the wrong repository, update it instead of adding a second `origin`:

```powershell
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

GitHub may open a browser sign-in flow. Complete authentication there; do not put a password or token directly into the remote URL.

## Publish Future Updates

After changing files, review and push updates with:

```powershell
git status --short
git add .
git diff --cached --check
git commit -m "Describe the change"
git push
```

Use a short commit message that describes the change, for example `Improve mobile shop filters`.

## If the Push Is Rejected

If the GitHub repository was accidentally created with a README or other initial commit, GitHub and your local repository may have unrelated histories. The cleanest option for a new project is to create an empty GitHub repository and push again. If you already have files on GitHub that must be kept, fetch and merge them deliberately rather than force-pushing over them.

## After Upload

- Open the repository page and confirm the README and source files appear.
- Confirm `.env` is absent and `.env.example` is present.
- Remember: uploading source code does not deploy the site. To make it available publicly, deploy the Next.js app to a hosting service and configure PostgreSQL and environment variables there.
