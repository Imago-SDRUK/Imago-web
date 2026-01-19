# Setup

## Environment variables

Create a `.env` file in the `apps/data_catalogue` directory based on the `.env.example` file. You will need to set the following variables:

```bash
# Database configuration
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
DB_SSL=

# CKAN configuration
CKAN_URL=

# Azure storage configuration
STORAGE_AZURE_ACCOUNT_NAME=
STORAGE_AZURE_ACCOUNT_KEY=
STORAGE_AZURE_CONTAINER=

# Ory services
IDENTITY_SERVER_PUBLIC=
IDENTITY_SERVER_ADMIN=
PERMISSION_SERVER_READ=
PERMISSION_SERVER_WRITE=

# Application configuration
ORIGIN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

## Database setup

The application uses Drizzle ORM for database management. To set up the database, run:

```bash
pnpm run db:generate
pnpm run db:migrate
```

## Technologies used

Please see [index](./index.md).

## CKAN configuration

TBC

## Troubleshooting

If you encounter any issues during setup or development, check the following:

- Ensure all environment variables are correctly set.
