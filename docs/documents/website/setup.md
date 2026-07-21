# Website Development Setup

## Environment variables

Create a `.env` file in the `apps/website` directory based on the `.env.example` file. You will need to set the following variables:

```bash
BACKEND_URL=http://127.0.0.1:8055 # assuming youre running directus on that port
BACKEND_TOKEN=
PUBLIC_NODE_ENV=development
RSA_PRIVATE_KEY=
RSA_PUBLIC_KEY=
MASTODON_USER=blog
MASTODON_HOSTNAME=
```

## Technologies used

- **SvelteKit**: Framework for building the application
- **Directus SDK**: For interacting with the Directus CMS

## Directus configuration

Please refer to the [Directus configuration.](../directus/setup.md)

## Troubleshooting

If you encounter any issues during setup or development, check the following:

- Ensure all environment variables are correctly set.
- Verify that the backend service is running and accessible.
- Check the console for any error messages and refer to the documentation for the respective tools and libraries.
