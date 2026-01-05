# ex-it

A simple project with GitHub Pages deployment via GitHub Actions.

## GitHub Pages Deployment

This repository includes two GitHub Actions workflows for deploying to GitHub Pages:

### 1. Automatic Deployment (deploy-pages.yml)
- **Triggers**: Automatically deploys to GitHub Pages when code is pushed to the `master` or `main` branch
- **Purpose**: Ensures the production site is always up-to-date with the latest changes in the main branch
- **Usage**: Simply merge your PR to master, and the site will be automatically deployed

### 2. Manual PR Deployment (deploy-pr-to-pages.yml)
- **Triggers**: Manual deployment via workflow_dispatch
- **Purpose**: Allows testing a PR branch on GitHub Pages before merging
- **Usage**: 
  1. Navigate to the "Actions" tab in the repository
  2. Select "Deploy PR to GitHub Pages" workflow
  3. Click "Run workflow"
  4. Select the branch you want to deploy
  5. Click "Run workflow" to deploy that branch to Pages

## Setup Requirements

To use these workflows, ensure GitHub Pages is enabled in your repository settings:
1. Go to repository Settings > Pages
2. Under "Source", select "GitHub Actions"
3. The workflows will now be able to deploy to Pages

**Note**: The workflows upload the entire repository to Pages. GitHub Pages automatically excludes files starting with `.` (including `.github/`) from being served, so sensitive configuration files are not exposed.

## Viewing Your Site

After deployment, your site will be available at: `https://<username>.github.io/<repository-name>/`