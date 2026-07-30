# Metadata

## Datasets

### Required fields

- Title: string // The title of the dataset
- Notes: string // A description of the dataset (can be markdown)
- License ID: string // [ID of one of these licenses](https://licenses.opendefinition.org/licenses/groups/ckan.json)

### Optional fields

These are the optional fields that can be added to the dataset. All of these can be left empty.

- Name: string // Only in case you don't want to derive the URL from the title
- Author: string // The name of the dataset's author
- Author email: string // The email address of the dataset's author
- Version: string // No longer than 100 characters
- State: string // The current state of the dataset, e.g. 'active' or 'deleted'
- Type: string // The type of the dataset
- Resources: Array\[Resources] // The dataset's resources
- Tags: Array\[unknown] // The dataset's tags
- Extras: Array<{ key: string; value: string }> // The dataset's extras (arbitrary key:value metadata)

#### Extras

The extras fields provides the ability to add arbitrary key-value pairs to the metadata. Here you can add any extra information you required and that is not included in the previous fields.
The keys must be unique, you can't have:

```json
# WRONG
[{key: 'fav_ice_cream', value: 'guanábana'}, {key: 'fav_ice_cream', value: 'maracuyá'}]
```

The way to handle multiple values is:

```json
# CORRECT
[{key: 'fav_ice_cream', value: 'guanábana, maracuyá'}]
```

The values can only be strings, so any submitted value to CKAN will be coerced as such.

As you may have noticed, this functionality is a bit restrictive, but we have the option to add JSON strings as values and have custom parsers for the frontend. Nevertheless, we should try keep any JSON strings as values to a minimum and only if they're truly essential or widely used across multiple data groups/datasets, as the parsers will only work for the website and not while ingesting the data via the API or in any other metadata sharing service.

## Resources

Resources are either a file or a link to a file that can be added to a dataset. A dataset can have many resources. Here are the fields that can be added to the resources metadata:

### Required

- Name: string // Name of the resource
- Description: string // Description of the resource (can be markdown)
- Format: string // Format of the resource

### Optional

- Hash: string // Hash of the resource
- Resource Type: string // Type of the resource
- MIME Type: string // MIMEType of the resource
- MIME Type Inner: string // MIMEType of the inner resource => if resource is a .tar.gz format compressing multiple .tiff files then this will be "image/tiff"

#### MIME Type

These can be found here [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types)
