# CI/CD

## Overview

The CI/CD pipeline is managed using GitHub Actions. The pipeline consists of two main workflows:

1. **Release Workflow**: Manages the release process using Changesets.
2. **Build Workflow**: Builds and pushes Docker images to the GitHub Container Registry (GHCR).

### Using Changesets

[Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) are used to manage versioning and changelogs in the project. To use Changesets:

1. **Create a Changeset**: Run the following command to create a new changeset:

   ```bash
   pnpm changeset
   ```

   This will prompt you to select the packages that have changed and the type of change (major, minor, patch).

2. **Add Changeset Files**: After creating a changeset, commit the changeset files to the repository.

3. **Trigger Release**: Push the changes to the `main` branch. The release workflow will automatically create a release pull request.

4. **Merge Pull Request**: Review and merge the release pull request. This will trigger the build workflow to build and push the Docker images.

## Release Workflow

The release workflow is defined in `.github/workflows/release.yml`. This workflow is triggered on pushes to the `main` branch and is responsible for creating release pull requests using Changesets.

### Workflow Details

- **Trigger**: Pushes to the `main` branch.
- **Concurrency**: Ensures that only one release workflow runs at a time for the `main` branch.
- **Permissions**: Requires write permissions for contents, issues, and pull requests.

### Steps

1. **Checkout Repository**: Checks out the repository code.
2. **Install pnpm**: Sets up pnpm for dependency management.
3. **Set up Node.js**: Configures Node.js version 22 and sets up caching for pnpm.
4. **Install Dependencies**: Installs the project dependencies using pnpm.
5. **Create Release Pull Request**: Uses the Changesets action to create a release pull request.

## Build Workflow

The build workflow is defined in `.github/workflows/build.yml`. This workflow is triggered when a release is published and is responsible for building and pushing Docker images to the [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

### Workflow details

- **Trigger**: Published releases.
- **Environment Variables**:
  - `REGISTRY`: GitHub Container Registry (GHCR).
  - `IMAGE_NAME`: The name of the Docker image, derived from the GitHub repository.

1. **Checkout Repository**: Checks out the repository code with full history.
2. **Get Tags**: Extracts the package name and version from the release tag.
3. **Log in to Container Registry**: Logs in to the GitHub Container Registry using a personal access token [GH_PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
4. **Set up QEMU**: Sets up QEMU for multi-architecture builds.
5. **Set up Docker Buildx**: Sets up Docker Buildx for building Docker images.
6. **Extract Metadata**: Extracts metadata (tags, labels) for the Docker image.
7. **Build and Push Docker Image**: Builds and pushes the Docker image to the GitHub Container Registry.

## Turbo configuration

Passthrough environment variables: `SENTRY_DSN`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `BRANCH`, `SENTRY_RELEASE`, `BUILDING`, `CI`.
