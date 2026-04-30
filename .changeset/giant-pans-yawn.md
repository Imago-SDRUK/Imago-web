---
'data_catalogue': major
---

This is a major refactor on the structure of the data catalogue, as the previous implementation limited the flexibility to add new features, services and made it difficult to track down issues and bugs. This architecture follows DDD and CA patterns, which will allow us to extend the platform to adapt new features easily. Authorisation includes new namespaces and enforces group permissions, splitting the logic between CKAN groups and authentication groups.

The implementation also considers easier testing but there are currently no tests working due to time constrains. Resources and versions have been implemented with editing and rewritten the handling of upload. Tags implementation has been reworked and dataset listing has been reworked. In the future, we might have to diverge from CKAN due to performance and implementation constrains, specifically on search and filtering through permissions. But this will require further time and careful consideration of the implementation of a search engine.

Breaking changes are mainly on our db implementation. Migration files have been added but there are a few minor fixes that must be manually done, specifically on questions and json fields.

There is now the requirement to set an superuser at first load. This should be manually set and will have overall permissions to all platform. Permissions are also to be manually adjusted due to the changes on namespaces and relations.

Groups can now be set for user self-enrolment on registration. Arktype has been added to handle payload validation. Errors are more clear and allow users to understand the issues with their file uploads.

