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

- **SvelteKit**: Framework for building the web application
- **TypeScript**: Primary language for type-safe development
- **Vite**: Build tool and development server
- **Sentry**: Error monitoring and reporting

### Integration

- **Node.js**: JavaScript runtime environment
- **PostgreSQL**: Relational database for application data
- **Drizzle ORM**: Type-safe SQL query builder
- **Azure Blob Storage**: Cloud storage for file uploads and downloads

### Authentication & authorization

- **Ory Kratos**: Identity management and user authentication
- **Ory Keto**: Permission management and access control

### Data management

- **CKAN**: Open-source data management system for metadata storage
- **Azure Storage SDK**: For handling file uploads/downloads to Azure Blob Storage

### Development and deployment tools

- **PNPM**: Package manager
- **Docker**: Containerization for development and deployment

## Architecture overview

The application is structured as follows:

1. **Client-Side**: Svelte components with reactive state management
2. **Server-Side**: SvelteKit endpoints for API routes and server-side rendering
3. **Database Layer**: PostgreSQL with Drizzle ORM for type-safe queries
4. **Authentication Layer**: Ory services for identity and permission management
5. **External Services**: CKAN integration for metadata, Azure for file storage

## Database layer

The application uses PostgreSQL with the following main tables:

### Core tables

- **users**: User accounts with status and preferences
- **resources**: Dataset resources with metadata
- **resource_versions**: Versioned resource files
- **questions**: Form questions for data collection
- **answers**: User responses to questions
- **downloads**: Tracking of resource downloads

### Relationships

- Users can create and own resources
- Resources have multiple versions
- Questions can have multiple answers
- Downloads are tracked per user and resource

## API endpoints

### REST API

- `/api/v1/datasets`: Dataset management
- `/api/v1/resources`: Resource management and file handling
- `/api/v1/users`: User management
- `/api/v1/groups`: Group management
- `/api/v1/permissions`: Permission management
- `/api/v1/questions`: Question management
- `/api/v1/answers`: Answer management

### CKAN API proxy

- `/api/action/[...path]`: Proxy to CKAN API for a subset of read-metadata operations

## Authentication

The system uses Ory Kratos for identity management and Ory Keto for permission management:

- **Session Management**: JWT-based authentication
- **Permission Model**: Relationship-based access control
- **Multi-Factor Authentication**: TOTP support
- **Role-Based Access**: Admin, editor, viewer, and public roles

## File storage

Files are stored in Azure Blob Storage with:

- **Signed URLs**: Temporary access URLs for secure uploads/downloads
- **SAS Tokens**: Secure access to blob storage
- **Container Management**: Organized storage structure

## Development setup

Please see [setup](/docs/docs/data_catalogue/setup.md).

## Deployment

The application is containerized using Docker and requires an Azure account for file storage.
