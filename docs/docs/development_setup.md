# Development

This guide provides instructions for setting up a development environment for this monorepo.

## Requirements

Before you begin, ensure you have the following installed:

- **PNPM**: [ˆ10](https://pnpm.io/installation)
- **Node.JS**: [LTS](https://pnpm.io/cli/env#use)
- **PostgreSQL**: [Postgis ˆ18](https://github.com/postgis/docker-postgis)
- **Azure Storage Account**

### Optional

- **Docker**: For database and service containers

## Initial Setup

### 1. Clone the repository

```bash
git clone git@github.com:Imago-SDRUK/Imago-web.git
```

### 2. Install dependencies

Install dependencies at the root level:

```bash
pnpm install
```

This will install all dependencies for all workspace packages.

## Configuration for apps/website

Refer to the [website documentation](../docs/website/setup.md) for its configuration.

## Configuration for apps/data_catalogue

Refer to the [data catalogue documentation](../docs/data_catalogue/setup.md) for its configuration.

## Running the applications

### 1. Start the development server

From the root of the monorepo:

```bash
pnpm run dev
```

This will start the development servers.

### 2. Access the application

Open your browser and navigate to:

```

Website
http://localhost:5174

Data catalogue
http://localhost:5174
```

## Troubleshooting

### Common issues

1. **Port conflicts**: Ensure ports 5173, 5174, 5432, and other service ports are available
2. **Database connection**: Verify PostgreSQL is running and credentials are correct
3. **Dependency issues**: Run `pnpm install` again if modules are missing
4. **Migration errors**: Check database connection and drop/recreate database if needed

### Reinstall

If you encounter persistent issues:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## CI/CD

Please see [CI/CD](/docs/docs/ci_cd.md).

## Additional resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/)
- [Ory Documentation](https://www.ory.sh/docs/)
- [CKAN Documentation](https://docs.ckan.org/)
