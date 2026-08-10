# CMS

This is the documentation for the CMS - Directus.

## Updating schema

After pulling the new image, run:

```bash
docker exec -it directus npx directus schema apply --yes /directus/schema/snapshot.yaml
```
