# Website

This is the developer documentation for [Imago website](https://imago.ac.uk).

## Contents

- [Tech stack](#tech-stack)
- [API endpoints](#api-endpoints)
- [Content management](#content-management)

## Tech stack

The website is built using the following technologies:

- **SvelteKit**: A framework for building web applications using Svelte.
- **Directus**: A headless CMS for managing content.

### Key Collections

1. **Articles**: Stores information about articles, including title, content, and publication date.
2. **Events**: Stores information about events, including title, content, and event date.
3. **Careers**: Stores information about job postings, including title, content, and posting date.

## Architecture overview

### Project structure

```text
├── apps/
│   ├── website/         # Imago website - fullstack SvelteKit application
│   │   ├── src/
│   │   │   ├── routes/          # SvelteKit routes and API endpoints
│   │   │   │   ├── (home)/        # Public routes
│   │   │   │   ├── assets/        # Directus resources proxy
│   │   │   │   ├── @blog/        # ActivityPub actor route
│   │   │   │   ├── [feeds=feeds]/ # RSS feed routes
│   │   │   │   ├── users/
│   │   │   │   │       └── blog/ # ActivityPub API endpoints
│   │   └── ...            # Configuration, build, and misc files
│   │       ├── package.json     # Project dependencies and scripts
│   │       ├── vite.config.ts   # Vite configuration
│   │       ├── svelte.config.js # SvelteKit configuration
│   │       └── .env             # Environment variables
```

### API Endpoints

The website provides several API endpoints for ActivityPub and RSS feeds integrations. This has largely been inspired by [Maho's implementation.](https://maho.dev/2024/02/a-guide-to-implement-activitypub-in-a-static-site-or-any-website/)

> [!Note]
> ActivityPub endpoints are located under /users. Currently the versioned API endpoints inside /api/v1/activity-pub are used for internal requests. This should be migrated to internal fn handling to avoid any confusions.

### RSS feeds

- **GET /rss.xml**: Generates an RSS feed for articles and events.
- **GET /\[feeds=feeds]/events.xml**: Generates an RSS feed for events.
- **GET /\[feeds=feeds]/careers.xml**: Generates an RSS feed for careers.

## Content management

The website uses Directus for managing content. Directus provides a flexible and extensible way to manage content, including articles, events, careers, and other relevant information. Please refer to their [usage documentation](https://directus.io/docs/guides/data-model/collections) for more information on how to add, delete and manage content. For developer documentation, please refer to the [api documentation.](https://directus.io/docs/api)

> [!Note]
> We're currently using Directus 11. From Directus 12 onwards there is a licensing scheme for the usage of this service, even if it is selfhosted. Before migrating to version 12, we'll need to apply for the [OIG](https://directus.com/oig), which would allow us to use Directus for free at least until we reach their usage limits.

### Resources

Currently the resources are stored in the fs. To migrate to any cloud storage service you'll need to manually migrate these files too.

The binary file data is proxied through the /assets endpoint. This allows us to:

- Not expose CMS resources to unauthenticated requests
- Put Cloudflare in front of the website to cache the files.

### Content flow

1. The user interacts with the website, triggering a Directus API request.
2. The request is handled using the Directus SDK.
3. Directus returns a response.
4. The response is returned to the user.
