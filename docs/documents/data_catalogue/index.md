# Data catalogue

This is the developer documentation for [Imago Data Catalogue](https://data.imago.ac.uk).

## Contents

- [Tech stack](#tech-stack)
- [Architecture overview](#architecture-overview)
- [Database layer](#database-layer)
- [API endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File storage](#file-storage)

## Tech stack

### Language and frameworks

- **SvelteKit**: Framework for building the web application
- **TypeScript**: Primary language for type-safe development

### Integration

- **Node.js**: JavaScript runtime environment
- **PostgreSQL**: Relational database for application data
- **Drizzle ORM**: Type-safe SQL query builder
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

The application is following DDD/CA principles.

### Project structure

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
│   │   │   ├── infrastructure/ # External integrations (DB, APIs, services)
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
│   │   ├── api/             # API endpoints (server-side)
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
