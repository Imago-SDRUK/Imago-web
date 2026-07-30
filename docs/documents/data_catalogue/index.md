# Data catalogue

This is the developer documentation for [Imago Data Catalogue](https://data.imago.ac.uk).

## Contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Architecture overview](#architecture-overview)
- [Database layer](#database-layer)
- [API endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File storage](#file-storage)

## Overview

The data catalogue is a fullstack SvelteKit/Typescript application using Postgres as database. The application is built using CA/DDD principles.
Main services are Drizzle as ORM, Arktype as [schema](https://standardschema.dev/) validator, Ory Kratos as authentication, Ory Keto as permissions, CKAN for metadata storage and Azure for file storage.

## Tech stack

### Language and frameworks

- **SvelteKit**: Framework for building the web application
- **TypeScript**: Primary language for type-safe development

### Integration

- **Node.js**: JavaScript runtime environment
- **PostgreSQL**: Relational database for application data
- **Drizzle ORM**: Type-safe SQL query builder
- Arktype: Schema validator
- **Azure Blob Storage**: Cloud storage for file uploads and downloads
- **Vite**: Build tool and development server
- **Sentry**: Error monitoring and reporting

### Authentication & authorization

- **Ory Kratos**: Identity management and user authentication
- **Ory Keto**: Permission management and access control

### Data management

- **CKAN**: Open-source data management system for metadata storage

### Storage

- **Azure Storage SDK**: For handling file uploads/downloads to Azure Blob Storage

### Development and deployment tools

- **PNPM**: Package manager
- **Docker**: Containerization for development and deployment

## Architecture overview

This is a fullstack application that follows DDD/CA principles. The structure is based on SvelteKit best practices with the $lib/server containing most of the backend implementation.
It is recommended to have a good understanding of SvelteKit's [core concepts](https://svelte.dev/docs/kit/routing) aside from Svelte. [Advanced routing](https://svelte.dev/docs/kit/advanced-routing), [Hooks](https://svelte.dev/docs/kit/hooks), [Errors](https://svelte.dev/docs/kit/errors), [Server only modules and environments](https://svelte.dev/docs/kit/server-only-modules), [Dynamic environment variables](https://svelte.dev/docs/kit/environment-variables) and [Node servers](https://svelte.dev/docs/kit/adapter-node) are also used in the application, so it is important to be familiar with these concepts.

### Project structure

#### Frontend structure

Frontend code is any code that can run in the browser and does not import any environment variables that are not prefixed with PUBIC_. Components are located inside the $lib/ui folder and global/shared components must be imported from the @imago/ui package. +page.svelte are the pages that contain UI code for user interaction.

#### Backend structure

Data loading and posting follows the same pattern:

```text
Incoming
request => hooks => sveltekit caller => controller => use case => infrastructure.

Outgoing
infrastructure => use case => controller => sveltekit caller => hooks => response.
```

Hooks are called each time there is a request. hooks.client.ts are used to handle client-side requests (imagine SPA), and in this project are only used for Sentry. hooks.server.ts are used to handle authentication, check if ckan is available, load the existing configuration and enrich the request.locals object, refer to app.d.ts for the type definition. Inside this file as well there is an init function that runs after the first request since service boot only. We use it to apply any existing migrations.

'Sveltekit caller' can be either a page server load fn, a form action or a remote function. These call 'controllers', which will have a type definition for any required parameters, plus configuration and session. Controllers verify a session exists, load and pass (inject) the required modules for the use cases, call the respective use cases and implement data presentators. These use cases are the ones that contain our business logic; they make use of the injected dependencies (repositories and/or services), and perform our tasks. Authorisation happens inside use cases.

Infrastructure (repositories and/or services) are the available data layers, that is, Drizzle, CKAN, Ory, Azure.

Please refer to the [following diagram](#key-files-and-directories) to understand the location of each of these file types.

##### Error handling

Aside from using Svelte's error, redirect, fail and invalid fns, errors are passed up the stack to be handled appropriately. Infrastructure, use cases and controller responses are wrapped in either an ok or err fn. This allows for typed errors, stops throwing errors around and makes code clearer and predictable. Wrap all unsafe functions inside the server folder with ok and err, and then handle accordingly inside the Svelte caller.

##### API folder

We've exposed 2 API endpoints. '/api/v1/resources/[...id]' enables user resource download without opening a new tab or the file in the same window. '/api/v1/users' takes a POST request to create a user with information that is incoming from Ory Kratos. The request is verified by the IDENTITY_TOKEN environment variable. Make sure this is the same value set in Ory Kratos.

`/api/action/[...path]` is a subset of [CKAN actions](https://docs.ckan.org/en/latest/api/) for compatibility with SDRUK's data catalogue.

#### Key Files and Directories

```text
data_catalogue/   # Data catalogue - fullstack SvelteKit application
├── src/
│   ├── lib/
│   │   ├── db/          # Database configuration
│   │   │   ├── migrations/    # Database migrations
│   │   │   ├── index.ts/      # Database configuration
│   │   ├── server/          # Backend application code
│   │   │   ├── entities/      # Domain models and business logic
│   │   │   │   ├── models/     # Data models and schemas
│   │   │   │   └── utils/      # Utilities for domain logic
│   │   │   ├── modules/       # Business logic modules (e.g., datasets, users, auth)
│   │   │   ├── infrastructure/ # External integrations (DB, services)
│   │   │   │   ├── services/   # Service implementations (e.g., CKAN, Azure, Kratos)
│   │   │   │   ├── repositories/ # Data access layers
│   │   │   ├── application/   # Use cases and application services
│   │   │   │   ├── services/   # Application-level services
│   │   │   │   ├── repositories/ # Repository interfaces
│   │   │   │   ├── use_cases/  # Business use cases
│   │   │   │   └── context/    # Application context and dependencies
│   │   │   └── interface/     # API and request/response handling
│   │   │       └── adapters/  # Controllers and adapters
│   │   ├── ui/   # Reusable UI components
│   ├── routes/              # SvelteKit routes and API endpoints
│   │   ├── api/             # API endpoints
│   │   │   ├── v1/           # Versioned API routes for user creation and file download
│   │   │   └── action/[...path]       # Proxy to CKAN API for a subset of read-metadata operations
│   │   ├── (app)/           # Authenticated application routes
│   │   │   ├── datasets/     # Dataset management routes
│   │   │   ├── admin/        # Admin dashboard and settings
│   │   │   └── user/         # User account
│   │   ├── auth/            # Authentication flows (Ory Kratos)
│   │   ├── +layout.svelte   # Root layout
│   ├── hooks.client.ts     # Client-side hooks
│   ├── hooks.server.ts     # Server-side hooks
│   └── instrumentation.ts # Application instrumentation
└── ...              # Configuration, build, and misc files
```

#### Routes Structure

- **`routes/(app)/`**:
  - **`datasets/`**: Dataset management (CRUD operations, metadata).
  - **`admin/`**: Admin dashboard and settings (users, permissions, registration).
  - **`user/`**: User account management and registration.

- **`routes/auth/`**: Authentication flows powered by Ory Kratos (login, registration, recovery).

- **`routes/api/`**:
  - **`action/`**: Subset of CKAN API proxy endpoints.

## Authentication

The system uses Ory Kratos for identity management. We use the browser authentication flows and use cookies to keep track of authentication and sessions.
For signing up, the system requires a SMTP service. We use Azure Communication Services, which allows Kratos to send transactional emails. For our current infrastructure, we need to request from NUIT a new connection string each year at the beginning of July to avoid any downtime.

At email verification, Kratos calls the data catalogue API to create and register the user in the data catalogue. This endpoint is protected and can only be used by Kratos and the shared secret.

## Authorisation

The system uses Ory Keto for permission (ReBAC) management. Please refer to the ory repository for further information on the relationships and permissions.

### Namespaces

- User
- Group
- Dataset
- Resource
- ResourceVersion
- Question
- Answer
- Application

## File storage

Files are stored in Azure Blob Storage. Using the Azure SDK we can get pre-signed URLs for uploads and downloads.

## Development setup

Please see [setup](./setup.md).

## Deployment

The application is containerized using Docker and requires an Azure account for file storage.
