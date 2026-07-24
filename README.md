# Imago - SDRUK

## Monorepo for Imago

### Current projects

- [Imago website](https://imago.ac.uk)
- [Imago data catalogue](https://data.imago.ac.uk)
- Imago UI package
- Imago CKAN client
- Imago CMS configuration (Directus)

## Project structure

```text
├── .changeset/         # Monorepo changesets
├── .github/            # CI/CD workflows
├── apps/               # Imago applications
│ ├── cms/              # Directus configuration and Dockerfile
│ ├── data_catalogue/   # Data catalogue - fullstack application
│ ├── website/          # Imago website - fullstack application
├── packages/           # Shared libraries
│ ├── config/           # ESLint and Typescript rules
│ ├── ui/               # UI/components library
  ...                   # Readme, changelog and monorepo configuration files
```

## Documentation

Please refer to the [documentation.](/docs/documents/index.md)

## Contributing

### Development

Please refer to the [development documentation](/docs/documents/development_setup.md).

### Commits

Follow [angular guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md):

```text
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

### Versioning

We are using [Changesets](https://github.com/changesets/changesets) to manage the versions of the apps and packages. Once you've completed a fix or feature and want to merge/pr, run

```
pnpm changeset
```

and follow the instructions.

The changeset should be included in the commit or any subsequent commits.

> [!Note]
> If you don't want your commits/pr to trigger a release you don't need to add a changeset.
