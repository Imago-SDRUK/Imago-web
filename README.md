# Imago - SDRUK

## Monorepo for Imago

### Current projects

- [Imago website](https://imago.ac.uk)
- [Imago data catalogue](https://data.imago.ac.uk)
- Imago UI package
- Imago CKAN client
- Imago CMS configuration (Directus)

### Content

- [Documentation](./docs/docs/index.md)
- [Developing](./docs/docs/development_setup.md)
- [Contributing](#contributing)

## Contributing

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

Before any pull requests run

```
pnpm changeset
```

and follow the instructions.
