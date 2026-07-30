# Setup

## Environment variables

Create a `.env` file in the `apps/cms` directory based on the `.env.example` file. It is recommended to have a look and ask to a fellow developer to provide you with an updated copy of the environment variables if needed, for example, in the case of using external/cloud storage, or a cache db.

```bash
# The main env variables to setup are these ones
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USER=
DB_PASSWORD=
DB_SSL=

SECRET=

```

## Scripts

Most relevant scripts are:

```bash

pnpm run types # generates the project type definitions
pnpm run gen:schema # generate the project schema, the schema does not include data
pnpm run migrate # apply directus migrations, use only for directus version changes
```

## Database setup

Directus requires a [Postgis](https://postgis.net) database for geometry support. Make sure to [follow their instructions](https://postgis.net/documentation/getting_started/) to install it. If you're using a computer with MacOS, Postgis is included in the Postgres.app. This is the recommended way for running Postgis in ARM computers as currently there are no official Postgis images for ARM.

### Migrations

After making any schema changes to your local Directus service, from inside the /app/cms folder generate a snapshot:

```bash
pnpm run gen:schema
```

Navigate back to the root folder, and create a changeset describing your changes, commit and create a pull request.

```bash
pnpm changeset
```

Once the image is built and pulled on the production server, run:

```bash
docker exec -it <name-of-container> directus schema apply /directus/schema/snapshot.yaml
```

> [!Important]
> Make sure to not apply manually any schema changes through the Admin UI and just do it from local to production as described in this guide. This as applying the schema will override any changes done to the production service.

## Develop

There are no custom extensions or logic for the CMS. The only extensions that are being used are the WYSWYG editor based on TipTap included in the Dockerfile. The extension uses TipTap v2. Do not upgrade to TipTap v3 unless you have a migration plan which would require replacing the current extension and migrating the existing data that relies on it.

## Troubleshooting

If you encounter any issues during setup or development, check the following:

- Ensure all environment variables are correctly set.
- Verify that the port 8055 is unused.
