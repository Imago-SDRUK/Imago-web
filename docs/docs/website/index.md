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

## API Endpoints

The website provides several API endpoints for ActivityPub and RSS feeds integrations. This has largely been inspired by [Maho's implementation](https://maho.dev/2024/02/a-guide-to-implement-activitypub-in-a-static-site-or-any-website/).

### ActivityPub

- **GET /@blog**: Provides ActivityPub information for the Mastodon account.
- **GET /api/v1/activity-pub/publish/articles/[id]**: Publishes an article to Mastodon followers.
- **POST /api/v1/activity-pub/undo**: Handles unfollow requests from Mastodon.
- **POST /api/v1/activity-pub/create**: Handles follow requests from Mastodon.
- **POST /api/v1/activity-pub/publish**: Publishes content to Mastodon.
- **POST /api/v1/activity-pub/follow**: Handles follow requests from Mastodon.

### RSS feeds

- **GET /rss.xml**: Generates an RSS feed for articles and events.
- **GET /[feeds=feeds]/events.xml**: Generates an RSS feed for events.
- **GET /[feeds=feeds]/careers.xml**: Generates an RSS feed for careers.

## Content management

The website uses Directus for managing content. Directus provides a flexible and extensible way to manage content, including articles, events, careers, and other relevant information. Please refer to their [usage documentation](https://directus.io/docs/guides/data-model/collections) for more information on how to add, delete and manage content. For developer documentation, please refer to the [api documentation](https://directus.io/docs/api).

### Content flow

1. The user interacts with the website, triggering a Directus API request.
2. The request is handled using the Directus SDK.
3. The content is retrieved or updated in the Directus database.
4. The response is returned to the user.
