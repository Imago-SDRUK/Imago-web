# Imago - SDRUK

## Monorepo for Imago

### Current projects

- [Imago website](https://imago.ac.uk)
- [Imago data catalogue](https://data.imago.ac.uk)
- Imago UI package
- Imago CKAN client
- Imago CMS configuration (Directus)

### Development

#### Tools

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

#### Installation

##### PNPM and NodeJS

It is recommended to install [PNPM](https://pnpm.io/installation) first with their bash script and then manage your Node versions using PNPM.
Install the latest version of NodeJS with PNPM:

```
pnpm runtime set node lts -g
```

If you want to install PNPM using npm, you'd need to instal [Node](https://nodejs.org/en/download) and npm first and then pnpm.

##### Docker

Install [Docker](https://docs.docker.com/get-started/get-docker/) as per their instructions.

##### Postgres

We're using version 18. Install as [per their instructions](https://www.postgresql.org/download/). For MacOS, it is recommended to install it using the [Postgres.app](https://postgresapp.com/) or [MacPorts](https://ports.macports.org/port/postgresql18/).

> [!NOTE]
> Directus requires a Postgis image to be used for geometry support.

##### Services

To use Directus, CKAN (CKAN, Solr, Datapusher, Valkey), Ory Kratos and Ory Keto you'll need to use Docker. You can find the CKAN docker compose file [here](https://github.com/imago-SDRUK/ckan). You can find the Ory Kratos and Ory Keto docker compose file [here.](https://github.com/artgpz/imago-ory) Refer to each repository for development and deployment details.

## Contributing

### Versioning

We are using [Changesets](https://github.com/changesets/changesets) to manage the versions of the apps and packages. Once you've completed a fix or feature and want to merge/pr, run

```
pnpm changeset
```

and follow the instructions.

The changeset should be included in the commit or any subsequent commits.

### Commits

Follow [angular guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md):

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: animations|bazel|benchpress|common|compiler|compiler-cli|core|
  │                          elements|forms|http|language-service|localize|platform-browser|
  │                          platform-browser-dynamic|platform-server|router|service-worker|
  │                          upgrade|zone.js|packaging|changelog|docs-infra|migrations|
  │                          devtools
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test


```

Scope is optional.
