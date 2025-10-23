# @imago/ui

## 1.0.1
### Patch Changes

- 01e354e: Add functional search making use of ckan endpoints for solr. Will have to evaluate feature pairity with ckan /dataset and /search, and try implement the current functionality for search in our /datasets to enable filtering with the required/enabled filters.
  
  Also add resource page, match auth /login layout, add handling search params from client and on the server, improve ui.
- c305642: add pagination to dataset page, scroll available filters, improve ui of product page, breakdown product/dataset page into components, initial auth flows setup with ory

## 1.0.0
### Major Changes

- 7255ca4: all main components that can be shared have been moved to the ui package. Moreover the ui package contains theming, css reset and icons. Replacement of components has been handled in the website app, and the data catalogue app is currently being build with the ui package.

### Patch Changes

- adca743: initial data catalogue build, improves to website, new components, adjust ts and eslint config
