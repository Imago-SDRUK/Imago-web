# Website Development Setup

## Environment variables

Create a `.env` file in the `apps/website` directory based on the `.env.example` file. You will need to set the following variables:

```bash
BACKEND_URL=
BACKEND_TOKEN=
RSA_PRIVATE_KEY=
RSA_PUBLIC_KEY=
```

## Technologies used

- **SvelteKit**: Framework for building the application
- **Directus SDK**: For interacting with the Directus CMS

## Directus configuration

TBC

## Additional notes

- The application uses SvelteKit for routing and server-side rendering.
- Tailwind CSS is used for styling, with additional plugins for forms, typography, and container queries.
- The application integrates with a Directus backend for data management.
- Mastodon API is used for social media features, including digital signatures and activity streams.

## Troubleshooting

If you encounter any issues during setup or development, check the following:

- Ensure all environment variables are correctly set.
- Verify that the backend service is running and accessible.
- Check the console for any error messages and refer to the documentation for the respective tools and libraries.
