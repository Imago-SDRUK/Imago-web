# @imago/ui

## 1.0.18
### Patch Changes

- 21fcceb: Fixes on empty css variables. Update dependencies. Upgrade UI components and new features. Implements an experimental select with melt ui.

## 1.0.17
### Patch Changes

- 9ac9e19: Revamp admin page, add tables for data, move fetch operations to forms, move form logic to endpoint for future rest/cli integration

## 1.0.16
### Patch Changes

- 9eab00b: add new role, add state of imagery to nav, scroll to team on click, open external links in new tab

## 1.0.15
### Patch Changes

- 0745ce6: add icons

## 1.0.14
### Patch Changes

- fd9008e: add beta version notices
  clear search button

## 1.0.13
### Patch Changes

- d03cb8b: add checkbox

## 1.0.12
### Patch Changes

- 567dbfd: improve ui, add temp resolution, edit file format

## 1.0.11
### Patch Changes

- 3f475ff: fix filters to use the field they need, fix missing licenses on filter, select group on dataset creation

## 1.0.10
### Patch Changes

- 345d932: set the metadata fields at creation, remove the removal and adding of extra fields

## 1.0.9
### Patch Changes

- 64d7f08: trigger build

## 1.0.8
### Patch Changes

- c81657a: add favicon and apple only favicons, handle a bug on metadata activity stream if the dataset is undefined, refactor file upload and download, now the resource id endpoint handles the transformation of the url

## 1.0.7
### Patch Changes

- a86a03f: trigger release

## 1.0.6
### Patch Changes

- 36dbd5d: modify package, trigger build

## 1.0.5
### Patch Changes

- f88761b: ready for alpha version 11/12/2025
  add get url from envs
  add page title
  fix resources padding on dataset page

## 1.0.4
### Patch Changes

- e8131fc: adds tiptap as md editor, changes ui, adds new icons, remove heading, org filters and disables links until further notice

## 1.0.3
### Patch Changes

- ffa4dd8: Fix and update UI

## 1.0.2
### Patch Changes

- 1c19a8f: Fix newsletter input.
  Fix notification stye.

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
