# Development

This guide provides instructions for setting up a development environment for this monorepo.

## Tools

Tools required for development:

- [PNPM](https://pnpm.io/)
- [NodeJS](https://nodejs.org/en)

For website:

- [Directus](https://directus.io/)

For data catalogue:

- [Postgres](https://www.postgresql.org/)
- [CKAN](https://ckan.org/)
- [Ory Keto](https://www.ory.com/keto)
- [Ory Kratos](https://www.ory.com/kratos)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup

### Requirements

Before you begin, ensure you have the following installed:

- **PNPM**: [ˆ11](#pnpm-and-nodejs)
- **Node.JS**: [LTS](#pnpm-and-nodejs)
- **PostgreSQL**: [Postgis ˆ18](#postgres)

### PNPM and NodeJS

It is recommended to install [PNPM](https://pnpm.io/installation) first with their bash script and then manage your Node versions using PNPM.
Install the latest version of NodeJS with PNPM:

```
pnpm runtime set node lts -g
```

If you want to install PNPM using npm, you'd need to instal [Node](https://nodejs.org/en/download) and npm first and then pnpm.

### Docker

Install [Docker](https://docs.docker.com/get-started/get-docker/) as per their instructions.

### Postgres

We're using version 18. Install as [per their instructions](https://www.postgresql.org/download/). For MacOS, it is recommended to install it using the [Postgres.app](https://postgresapp.com/) or [MacPorts](https://ports.macports.org/port/postgresql18/).

> [!NOTE]
> Directus requires a [Postgis](https://github.com/postgis/docker-postgis) image to be used for geometry support.

### Services

To use CKAN (CKAN, Solr, Datapusher, Valkey), Ory Kratos and Ory Keto you'll need to use Docker. You can find the CKAN docker compose file [here](https://github.com/imago-SDRUK/ckan). You can find the Ory Kratos and Ory Keto docker compose file [here.](https://github.com/artgpz/imago-ory) Refer to each repository for development and deployment details.

Directus runs in alongside the monorepo server at /apps/cms. Make sure to set up the environment valiables for it before running the application.

### Monorepo

[Clone and install](#1-clone-the-repository) the dependencies of this repository. For the data catalogue and Directus you'll need to setup a Postgres database.

### Optional

- **Azure Storage Account**: To test file upload/download functionality in the data catalogue

## Initial Setup

### 1. Clone the repository

```bash
git clone git@github.com:Imago-SDRUK/Imago-web.git

# Go to folder
cd Imago-web
```

### 2. Switch to dev branch

```bash
git checkout -b dev origin/dev
```

### 3. Install dependencies

Install dependencies at the root level:

```bash
pnpm install
```

This will install all dependencies for all workspace apps and packages.

#### Configuration for apps/website

Refer to the [website documentation](./website/setup.md) for its configuration.

#### Configuration for apps/data\_catalogue

Refer to the [data catalogue documentation](./data_catalogue/setup.md) for its configuration.

#### Configuration for apps/cms

Refer to the [directus documentation](./directus/setup.md) for its configuration.

## Running the applications

### 1. Start the development server

From the root of the monorepo:

```bash
pnpm run dev
```

This will start the development servers.

### 2. Access the application

Open your browser and navigate to:

```text

Website
http://127.0.0.1:5173

Data catalogue
http://127.0.0.1:5174

CMS
http://127.0.0.1:8055

```

## Troubleshooting

### Common issues

1. **Port conflicts**: Ensure ports 5173, 5174, 5432, and other service ports are available
2. **Database connection**: Verify PostgreSQL is running and credentials are correct
3. **Dependency issues**: Run `pnpm install` again if modules are missing

### Reinstall

If you encounter persistent issues:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## CI/CD

Please see [CI/CD](./ci_cd.md).

## Additional resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/)
- [Ory Documentation](https://www.ory.sh/docs/)
- [CKAN Documentation](https://docs.ckan.org/)
