# Setup

## Environment variables

Create a `.env` file in the `apps/data_catalogue` directory based on the `.env.example` file. You will need to set the following variables:

```bash

#Svetekit
NODE_ENV=development
PUBLIC_NODE_ENV=development
LOG_LEVEL=trace
PUBLIC_IMAGO_URL=http://127.0.0.1:5173
PUBLIC_IMAGO_DATA_CATALOGUE_URL=http://127.0.0.1:5174
MIGRATION_PATH='./src/lib/db/migrations'

# Database configuration
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
DB_SSL=false
DATABASE_URL=
DB_MIGRATING=
DB_SEEDING=

# CKAN configuration
CKAN_URL=
CKAN_TOKEN=# you need to generate this token

# Ory services
IDENTITY_SERVER_PUBLIC=
IDENTITY_SERVER_ADMIN=
IDENTITY_SERVER_PUBLIC=http://127.0.0.1:4433
IDENTITY_SERVER_ADMIN=http://127.0.0.1:4434
PERMISSION_SERVER_READ=
PERMISSION_SERVER_WRITE=
PERMISSION_SERVER_READ=http://127.0.0.1:4466
PERMISSION_SERVER_WRITE=http://127.0.0.1:4467

# Azure storage configuration
STORAGE_AZURE_ACCOUNT_NAME=
STORAGE_AZURE_ACCOUNT_KEY=
STORAGE_AZURE_CONTAINER=

# Application configuration
ORIGIN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# sentry
PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

## Scripts

Most relevant scripts are:

```bash
pnpm run dev # run the development server, uses Vite for HMR
pnpm run build # build the application
pnpm run preview # preview the current build, must build the application first
pnpm run format # optional: if your text editor formats on save you won't need to run this
pnpm run test # run both unit and e2e tests
pnpm run test:unit # run unit tests
pnpm run test:e2e # run e2e test
pnpm run db:generate # generate migrations
pnpm run db:migrate # migrate changes
pnpm run db:drop # remove a bad migration
```

## Database setup

The application uses Drizzle ORM for database management. At boot time, the application will automatically run the pending migrations. This is located inside the hooks.server.ts file, inside the init fn.

### Migrations

After changes to the entities, to generate migrations, run:

```bash
pnpm run db:generate
```

If you want to run the migrations

```bash
pnpm run db:migrate
```

## Develop

Please refer to the [main development docs.](../development_setup.md)

> [!NOTE]
> You should only run pnpm scripts from this folder if you require it and know what you're doing.

```bash
pnpm run dev --host
```

This will start the development server at 127.0.0.1:5734.

To run the development server run:

```bash
pnpm run dev --host
```

## Technologies used

Please see [index](./index.md).

## Troubleshooting

If you encounter any issues during setup or development, check the following:

- Ensure all environment variables are correctly set.
- Verify that the backend services are running and accessible: Ory Kratos, Ory Keto, CKAN, Solr, Postgres.
- Check the console for any error messages and refer to the documentation for the respective tools and libraries.
