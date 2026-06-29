# data-catalogue

## 3.0.25
### Patch Changes

- c521ddf: add errors fmt
  fix resource service fn
  add permission check
  fix pass allow manage registration
  fix conditional delete dataset on permissions
  feat add err page for dataset edit
  fix conditional delete edit resource
- 7fa2dd9: purge dataset instead of delete

## 3.0.24
### Patch Changes

- 46c8139: add errors fmt
  fix resource service fn
  add permission check
  fix pass allow manage registration
  fix conditional delete dataset on permissions
  feat add err page for dataset edit
  fix conditional delete edit resource

## 3.0.23
### Patch Changes

- a9c0506: allow dashboard access to selected groups
  enable remote functions
  fix permissions resource upload
  fix resource size and format
  add application domain

## 3.0.22
### Patch Changes

- 7e2bdf8: revert colour

## 3.0.21
### Patch Changes

- 13a2170: add delete tags

## 3.0.20
### Patch Changes

- a843de6: add issues notice back
- c6c2d9e: fix mobile views

## 3.0.19
### Patch Changes

- b09a778: fix assert question id in validation

## 3.0.18
### Patch Changes

- 5e213ae: improve accessibility, #71

## 3.0.17
### Patch Changes

- 6b69aea: public return unauth early

## 3.0.16
### Patch Changes

- 7eacdd5: fix button send to datasets, fix search str interpolation, move identity logic to use cases and add controllers, consolidate resource download logic, cleanup

## 3.0.15
### Patch Changes

- 64a4913: remove beta label, add extra information on landing, add redirect to resource page when user is not logged in

## 3.0.14
### Patch Changes

- 001ac53: add option to select vocabulary on tag creation, add delete tag
- b5af729: add option to reset datastore metadata
- 102ed16: add session token login

## 3.0.13
### Patch Changes

- c942f5c: specify ui package dist folder

## 3.0.12
### Patch Changes

- d1bcf39: add temp overfetch

## 3.0.11
### Patch Changes

- 33c96a4: fix pnpm build issues

## 3.0.10
### Patch Changes

- 600e32f: move to pnpm 11, revert to alpine image
- f8b3476: fix file upload permissions errors and rollback errors

## 3.0.9
### Patch Changes

- 7523840: select overflow scroll

## 3.0.8
### Patch Changes

- d25ab78: fix filters, add filter by metadata group
- 838e1bf: add edit dataset metadata groups

## 3.0.7
### Patch Changes

- 5db3a31: revert to alpine, fix  build

## 3.0.6
### Patch Changes

- cf23e95: move to slim img

## 3.0.5
### Patch Changes

- 1b5bf25: revert img

## 3.0.4
### Patch Changes

- 01688ae: trigger build

## 3.0.3
### Patch Changes

- 4cb0d40: pass dataset id instead of param id

## 3.0.2
### Patch Changes

- a6ee7d8: disallow all robots

## 3.0.1
### Patch Changes

- e2173d5: sort by created desc, add dataset migrate tags action

## 3.0.0
### Major Changes

- 21fcceb: This is a major refactor on the structure of the data catalogue, as the previous implementation limited the flexibility to add new features, services and made it difficult to track down issues and bugs. This architecture follows DDD and CA patterns, which will allow us to extend the platform to adapt new features easily. Authorisation includes new namespaces and enforces group permissions, splitting the logic between CKAN groups and authentication groups.
  
  The implementation also considers easier testing but there are currently no tests working due to time constrains. Resources and versions have been implemented with editing and rewritten the handling of upload. Tags implementation has been reworked and dataset listing has been reworked. In the future, we might have to diverge from CKAN due to performance and implementation constrains, specifically on search and filtering through permissions. But this will require further time and careful consideration of the implementation of a search engine.
  
  Breaking changes are mainly on our db implementation. Migration files have been added but there are a few minor fixes that must be manually done, specifically on questions and json fields.
  
  There is now the requirement to set an superuser at first load. This should be manually set and will have overall permissions to all platform. Permissions are also to be manually adjusted due to the changes on namespaces and relations.
  
  Groups can now be set for user self-enrolment on registration. Arktype has been added to handle payload validation. Errors are more clear and allow users to understand the issues with their file uploads.

### Patch Changes

- e00a149: add utils for migration, fix dataset, resources and versions permissions

## 2.1.6
### Patch Changes

- 00b9e81: handle incomplete user registration, paginate users and groups on admin page

## 2.1.5
### Patch Changes

- 9ac9e19: Revamp admin page, add tables for data, move fetch operations to forms, move form logic to endpoint for future rest/cli integration

## 2.1.4
### Patch Changes

- 356d7b6: Improve UI, add additional info to err logs

## 2.1.3
### Patch Changes

- 7c8cd4c: add display resource downloads to admin page

## 2.1.2
### Patch Changes

- cf3e706: cleanup logs

## 2.1.1
### Patch Changes

- 33d8ca9: fix export of fn for build

## 2.1.0
### Minor Changes

- 160de27: Enable ckan api endpoint for get actions

## 2.0.14
### Patch Changes

- b9afa21: add detailed logging, move err logs to err

## 2.0.13
### Patch Changes

- 5771c0a: add description to questions, improve question reactivity, sort question order by created

## 2.0.12
### Patch Changes

- 8468b8f: fix double import

## 2.0.11
### Patch Changes

- 4a85d23: make private packages for admin and editors only
- 4daa8fc: trigger pipeline

## 2.0.10
### Patch Changes

- fd9008e: add beta version notices
  clear search button

## 2.0.9
### Patch Changes

- d03cb8b: add checkbox

## 2.0.8
### Patch Changes

- 390b50f: trigger build

## 2.0.7
### Patch Changes

- beb25c7: bring back log, add exception to stop breaking

## 2.0.6
### Patch Changes

- 43491bb: fix question edit

## 2.0.5
### Patch Changes

- 06c0549: add exception if api cookie

## 2.0.4
### Patch Changes

- f6b6065: trigger build

## 2.0.3
### Patch Changes

- 1843025: trigger build

## 2.0.2
### Patch Changes

- 894dbf9: add db migrations and db service

## 2.0.1
### Patch Changes

- 4e742ba: fix build and dev issues

## 2.0.0
### Major Changes

- dc71a3a: This implements authentication and authorisation for the data catalogue. Previous instances will have to be redeployed from scratch as permissions are not bootstraped. File handling is improved with versioning but updating a file version is currently not implemented in the frontend. There is no JWT/Token authorisation. Scripts and variables must be updated before redeploying

### Minor Changes

- 78aa436: this completes the authentication flow. set up drizzle and db schema to register users and resources, initialises the implementation of authorisation, add admin settings pages

## 1.1.16
### Patch Changes

- 567dbfd: improve ui, add temp resolution, edit file format

## 1.1.15
### Patch Changes

- 3f475ff: fix filters to use the field they need, fix missing licenses on filter, select group on dataset creation

## 1.1.14
### Patch Changes

- 345d932: set the metadata fields at creation, remove the removal and adding of extra fields

## 1.1.13
### Patch Changes

- 64d7f08: trigger build

## 1.1.12
### Patch Changes

- c81657a: add favicon and apple only favicons, handle a bug on metadata activity stream if the dataset is undefined, refactor file upload and download, now the resource id endpoint handles the transformation of the url

## 1.1.11
### Patch Changes

- a86a03f: trigger release

## 1.1.10
### Patch Changes

- e9f0b51: trigger build

## 1.1.9
### Patch Changes

- e3a63c9: trigger build

## 1.1.8
### Patch Changes

- f6f1c6f: pass env variables to build

## 1.1.7
### Patch Changes

- f88761b: ready for alpha version 11/12/2025
  add get url from envs
  add page title
  fix resources padding on dataset page

## 1.1.6
### Patch Changes

- 044c42f: Add ping ckan instance, add tags create and delete, refactor to make context reactive to invalidation, add activity stream, add access expire and make input password
- e8131fc: adds tiptap as md editor, changes ui, adds new icons, remove heading, org filters and disables links until further notice

## 1.1.5
### Patch Changes

- 544829c: fix build

## 1.1.4
### Patch Changes

- fd192d7: build issues

## 1.1.3
### Patch Changes

- 7a8b314: Trigger build

## 1.1.2
### Patch Changes

- cffbad2: This will install sentry as a devdependency. Image will build but it wont build locally. To build locally it needs sentry as dependency but building the docker image as dependency will increase the image from 342MB to 1.4GB

## 1.1.1
### Patch Changes

- 31c0407: fix build by copying node modules from builder

## 1.1.0
### Minor Changes

- d4020b1: ##First docker image release:
  
  - Add dataset search page
  - Add dataset view page
  - Add dataset edit page
  - Add file storage with Azure
  - Handle signed urls for upload-download
  - Add create and edit handle metadata fields
  - Add auth flows for Ory Kratos
  - Add typed Ckan js client
  - Add invite only access
  - Build docker image with sentry

## 1.0.1
### Patch Changes

- 01e354e: Add functional search making use of ckan endpoints for solr. Will have to evaluate feature pairity with ckan /dataset and /search, and try implement the current functionality for search in our /datasets to enable filtering with the required/enabled filters.
  
  Also add resource page, match auth /login layout, add handling search params from client and on the server, improve ui.
- c305642: add pagination to dataset page, scroll available filters, improve ui of product page, breakdown product/dataset page into components, initial auth flows setup with ory

## 1.0.0
### Major Changes

- adca743: initial data catalogue build, improves to website, new components, adjust ts and eslint config
