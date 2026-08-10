export interface ArticleSectionBlock {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   action: 'newsletter' | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   content: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   media: ArticleSectionBlocksFile[] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   section: ArticleSection | ArticleSection["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   size: 'small' | 'medium' | 'large' | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: 'text' | 'image' | 'cta' | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface ArticleSectionBlocksFile {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   article_section_blocks_id: ArticleSectionBlock | ArticleSectionBlock["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   directus_files_id: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;
}

export interface ArticleSection {

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   articles: ArticlesArticleSection[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   content: ArticleSectionBlock[] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   subtitle: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface Article {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   mastodon_replies: MastodonReply[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   media: ArticlesFile[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   sections: ArticlesArticleSection[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   slug: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface ArticlesArticleSection {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   article_sections_id: ArticleSection | ArticleSection["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   articles_id: Article | Article["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;
}

export interface ArticlesFile {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   articles_id: Article | Article["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   directus_files_id: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;
}

export interface Block {

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   actions: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   background_colour: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   content: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   media: BlocksFile[] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   style: 'general' | 'title_and_image' | 'title_only';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   subtitle: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface BlocksFile {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   blocks_id: Block | Block["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   directus_files_id: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;
}

export interface Career {

  /**
   * Timezone is UTC, adjust accordingly
   *
   * Type in directus: dateTime
   * Type in database: timestamp without time zone
   */
   closing_date: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   content: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   contract: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   hours: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   location: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   media: CareersFile[] | null;

  /**
   * No description.
   *
   * Type in directus: dateTime
   * Type in database: timestamp without time zone
   */
   posted_on: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   salary: string;

  /**
   * This is created automatically
   *
   * Type in directus: string
   * Type in database: character varying
   */
   slug: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   url: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface CareersFile {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   careers_id: Career | Career["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   directus_files_id: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;
}

export interface Contact {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   email: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   first_name: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   last_name: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusAccess {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   policy: DirectusPolicy | DirectusPolicy["id"];

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusActivity {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   action: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   ip: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   origin: string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   revisions: DirectusRevision[] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   timestamp: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   user_agent: string | null;
}

export interface DirectusCollection {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   accountability: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   archive_app_filter: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   archive_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   archive_value: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collapse: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   display_template: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   group: DirectusCollection | DirectusCollection["collection"] | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   hidden: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   item_duplication_fields: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   preview_url: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   singleton: boolean;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   sort_field: string | null;

  /**
   * $t:field_options.directus_collections.collection_naming_translations_note
   *
   * Type in directus: json
   * Type in database: json
   */
   translations: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   unarchive_value: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   versioning: boolean;
}

export interface DirectusComment {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   comment: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusDashboard {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   panels: DirectusPanel[] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusDeploymentProject {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   deployable: boolean;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   deployment: DirectusDeployment | DirectusDeployment["id"];

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   external_id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   framework: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   runs: DirectusDeploymentRun[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   url: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusDeploymentRun {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   completed_at: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   external_id: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   project: DirectusDeploymentProject | DirectusDeploymentProject["id"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   started_at: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   target: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   url: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusDeployment {

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   credentials: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   last_synced_at: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: text
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   projects: DirectusDeploymentProject[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   provider: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   webhook_ids: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   webhook_secret: string | null;
}

export interface DirectusExtension {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   bundle: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   enabled: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   folder: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   source: string;
}

export interface DirectusField {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   conditions: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   display: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   display_options: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   field: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   group: DirectusField | string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   hidden: boolean;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   interface: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   readonly: boolean;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   required: boolean | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   searchable: boolean;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: character varying
   */
   special: string[] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   translations: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   validation: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   validation_message: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   width: string | null;
}

export interface DirectusFile {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   charset: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   created_on: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   duration: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   embed: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   filename_disk: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   filename_download: string;

  /**
   * No description.
   *
   * Type in directus: bigInteger
   * Type in database: bigint
   */
   filesize: number | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   focal_point_x: number | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   focal_point_y: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   folder: DirectusFolder | DirectusFolder["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   height: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   location: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   metadata: any | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   modified_by: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   modified_on: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   storage: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: text
   */
   tags: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   tus_data: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   tus_id: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   uploaded_by: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   uploaded_on: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   width: number | null;
}

export interface DirectusFlow {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   accountability: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   operation: DirectusOperation | string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   operations: DirectusOperation[] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   trigger: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusFolder {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   parent: DirectusFolder | DirectusFolder["id"] | null;
}

export interface DirectusMigration {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   timestamp: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   version: string;
}

export interface DirectusNotification {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   message: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   recipient: DirectusUser | DirectusUser["id"];

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   sender: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   subject: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   timestamp: string | null;
}

export interface DirectusOperation {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   flow: DirectusFlow | DirectusFlow["id"];

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   key: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_x: number;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_y: number;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   reject: DirectusOperation | DirectusOperation["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   resolve: DirectusOperation | DirectusOperation["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusPanel {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   dashboard: DirectusDashboard | DirectusDashboard["id"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   height: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   note: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   options: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_x: number;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   position_y: number;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   show_header: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   width: number;
}

export interface DirectusPermission {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   action: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: text
   */
   fields: string[] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   permissions: any | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   policy: DirectusPolicy | DirectusPolicy["id"];

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   presets: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   validation: any | null;
}

export interface DirectusPolicy {

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   admin_access: boolean;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   app_access: boolean;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * $t:field_options.directus_policies.enforce_tfa
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   enforce_tfa: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: text
   */
   ip_access: string[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   permissions: DirectusPermission[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   roles: DirectusAccess[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   users: DirectusAccess[] | null;
}

export interface DirectusPreset {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   bookmark: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   color: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   filter: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   layout: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   layout_options: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   layout_query: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   refresh_interval: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   search: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusRelation {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   junction_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   many_collection: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   many_field: string;

  /**
   * No description.
   *
   * Type in directus: csv
   * Type in database: text
   */
   one_allowed_collections: string[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_collection: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_collection_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_deselect_action: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   one_field: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   sort_field: string | null;
}

export interface DirectusRevision {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   activity: DirectusActivity | DirectusActivity["id"];

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   data: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   delta: any | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   parent: DirectusRevision | DirectusRevision["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   version: DirectusVersion | DirectusVersion["id"] | null;
}

export interface DirectusRole {

  /**
   * $t:field_options.directus_roles.children_note
   *
   * Type in directus: alias
   * Type in database: no column
   */
   children: DirectusRole[] | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   icon: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string;

  /**
   * $t:field_options.directus_roles.parent_note
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   parent: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   policies: DirectusAccess[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   users: DirectusUser[] | null;
}

export interface DirectusSession {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   expires: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   ip: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   next_token: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   origin: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   share: DirectusShare | DirectusShare["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   token: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   user_agent: string | null;
}

export interface DirectusSetting {

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   ai_anthropic_allowed_models: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_anthropic_api_key: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   ai_google_allowed_models: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_google_api_key: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   ai_openai_allowed_models: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_openai_api_key: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_openai_compatible_api_key: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_openai_compatible_base_url: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   ai_openai_compatible_headers: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   ai_openai_compatible_models: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_openai_compatible_name: string | null;

  /**
   * $t:fields.directus_settings.ai_system_prompt_note
   *
   * Type in directus: text
   * Type in database: text
   */
   ai_system_prompt: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   auth_login_attempts: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   auth_password_policy: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   basemaps: any | null;

  /**
   * $t:fields.directus_settings.collaborative_editing_note
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   collaborative_editing_enabled: boolean;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   custom_aspect_ratios: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   custom_css: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_appearance: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_language: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_theme_dark: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   default_theme_light: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   mapbox_key: string | null;

  /**
   * $t:fields.directus_settings.mcp_allow_deletes_note
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   mcp_allow_deletes: boolean;

  /**
   * $t:fields.directus_settings.mcp_enabled_note
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   mcp_enabled: boolean;

  /**
   * $t:fields.directus_settings.mcp_prompts_collection_note
   *
   * Type in directus: string
   * Type in database: character varying
   */
   mcp_prompts_collection: string | null;

  /**
   * $t:fields.directus_settings.mcp_system_prompt_note
   *
   * Type in directus: text
   * Type in database: text
   */
   mcp_system_prompt: string | null;

  /**
   * $t:fields.directus_settings.mcp_system_prompt_enabled_note
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   mcp_system_prompt_enabled: boolean;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   module_bar: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   org_name: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   product_updates: boolean | null;

  /**
   * $t:field_options.directus_settings.project_color_note
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_color: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_descriptor: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   project_id: string | null;

  /**
   * $t:field_options.directus_settings.project_logo_note
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   project_logo: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_name: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_owner: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_status: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_url: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   project_usage: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_background: DirectusFile | DirectusFile["id"] | null;

  /**
   * $t:field_options.directus_settings.project_favicon_note
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_favicon: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_foreground: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   public_note: string | null;

  /**
   * $t:fields.directus_settings.public_registration_note
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   public_registration: boolean;

  /**
   * $t:fields.directus_settings.public_registration_email_filter_note
   *
   * Type in directus: json
   * Type in database: json
   */
   public_registration_email_filter: any | null;

  /**
   * $t:fields.directus_settings.public_registration_role_note
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   public_registration_role: DirectusRole | DirectusRole["id"] | null;

  /**
   * $t:fields.directus_settings.public_registration_verify_email_note
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   public_registration_verify_email: boolean;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   report_bug_url: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   report_error_url: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   report_feature_url: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   storage_asset_presets: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   storage_asset_transform: string | null;

  /**
   * $t:interfaces.system-folder.field_hint
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   storage_default_folder: DirectusFolder | DirectusFolder["id"] | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_dark_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_light_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   visual_editor_urls: any | null;
}

export interface DirectusShare {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | DirectusCollection["collection"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * $t:shared_leave_blank_for_unlimited
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_end: string | null;

  /**
   * $t:shared_leave_blank_for_unlimited
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_start: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * $t:shared_leave_blank_for_unlimited
   *
   * Type in directus: integer
   * Type in database: integer
   */
   max_uses: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * $t:shared_leave_blank_for_passwordless_access
   *
   * Type in directus: hash
   * Type in database: character varying
   */
   password: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   times_used: number | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;
}

export interface DirectusTranslation {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   key: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   language: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   value: string;
}

export interface DirectusUser {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   appearance: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   auth_data: any | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   avatar: DirectusFile | string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   email: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   email_notifications: boolean | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   external_identifier: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   first_name: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   language: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   last_access: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   last_name: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   last_page: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   location: string | null;

  /**
   * No description.
   *
   * Type in directus: hash
   * Type in database: character varying
   */
   password: string | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   policies: DirectusAccess[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   provider: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   role: DirectusRole | DirectusRole["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   tags: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   text_direction: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   tfa_secret: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   theme_dark: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_dark_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   theme_light: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   theme_light_overrides: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   token: string | null;
}

export interface DirectusVersion {

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   collection: DirectusCollection | DirectusCollection["collection"];

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   delta: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   hash: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   item: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   key: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   name: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface Event {

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   agenda: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   content: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: dateTime
   * Type in database: timestamp without time zone
   */
   date_end: string | null;

  /**
   * No description.
   *
   * Type in directus: dateTime
   * Type in database: timestamp without time zone
   */
   date_start: string;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   location: string;

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   map: any | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   media: EventsFile[] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   slug: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   subtitle: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: 'workshop' | 'conference' | 'meet_up' | 'social';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   url: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface EventsFile {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   directus_files_id: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   events_id: Event | Event["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;
}

export interface MastodonFollower {

  /**
   * No description.
   *
   * Type in directus: json
   * Type in database: json
   */
   actor: any | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   actor_id: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: boolean
   * Type in database: boolean
   */
   following: boolean | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   public_key: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface MastodonReply {

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   actor_id: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   article: Article | Article["id"] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   post_url: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   reply_url: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface Page {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   sections: PagesSection[] | null;

  /**
   * This is created automatically
   *
   * Type in directus: string
   * Type in database: character varying
   */
   slug: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   type: 'home' | 'general' | 'footer';

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface PagesSection {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   pages_id: Page | Page["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   sections_id: Section | Section["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;
}

export interface Product {

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface Section {

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   columns: number | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   content: SectionsBlocksContent[] | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   description: string | null;

  /**
   * This will customise the way the content is going to be displayed, if you're unsure use General
   *
   * Type in directus: string
   * Type in database: character varying
   */
   design: 'general' | 'cards' | 'columns' | 'stacks' | 'banner' | 'full_page';

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   left_column: SectionsBlocksLeftColumn[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   pages: PagesSection[] | null;

  /**
   * No description.
   *
   * Type in directus: alias
   * Type in database: no column
   */
   right_column: SectionsBlocksRightColumn[] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   subtitle: string | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   title: string | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}

export interface SectionsBlocksContent {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   blocks_id: Block | Block["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   sections_id: Section | Section["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;
}

export interface SectionsBlocksLeftColumn {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   blocks_id: Block | Block["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   sections_id: Section | Section["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;
}

export interface SectionsBlocksRightColumn {

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   blocks_id: Block | Block["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   id: number;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   sections_id: Section | Section["id"] | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;
}

export interface TeamMember {

  /**
   * No description.
   *
   * Type in directus: text
   * Type in database: text
   */
   content: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_created: string | null;

  /**
   * No description.
   *
   * Type in directus: timestamp
   * Type in database: timestamp with time zone
   */
   date_updated: string | null;

  /**
   * These are to add further information about the team member
   *
   * Type in directus: json
   * Type in database: json
   */
   facts: any | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   first_name: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   id: string;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   institution: 'newcastle_university' | 'university_of_liverpool' | 'harvard_university';

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   last_name: string;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   picture: DirectusFile | DirectusFile["id"] | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   role: 'rse' | 'researcher' | 'postdoc' | 'administrator' | 'co_director' | 'data_service_manager' | 'outreach_officer' | 'srse' | 'deputy_director' | 'partnerships_officer';

  /**
   * This will be generated automatically
   *
   * Type in directus: string
   * Type in database: character varying
   */
   slug: string | null;

  /**
   * No description.
   *
   * Type in directus: integer
   * Type in database: integer
   */
   sort: number | null;

  /**
   * No description.
   *
   * Type in directus: string
   * Type in database: character varying
   */
   status: 'published' | 'draft' | 'archived';

  /**
   * Can be a social media profile, website or any online reference you'd like to share
   *
   * Type in directus: json
   * Type in database: json
   */
   url: any;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_created: DirectusUser | DirectusUser["id"] | null;

  /**
   * No description.
   *
   * Type in directus: uuid
   * Type in database: uuid
   */
   user_updated: DirectusUser | DirectusUser["id"] | null;
}


export type Collections = {
  article_section_blocks: ArticleSectionBlock[];
  article_section_blocks_files: ArticleSectionBlocksFile[];
  article_sections: ArticleSection[];
  articles: Article[];
  articles_article_sections: ArticlesArticleSection[];
  articles_files: ArticlesFile[];
  blocks: Block[];
  blocks_files: BlocksFile[];
  careers: Career[];
  careers_files: CareersFile[];
  contacts: Contact[];
  directus_access: DirectusAccess[];
  directus_activity: DirectusActivity[];
  directus_collections: DirectusCollection[];
  directus_comments: DirectusComment[];
  directus_dashboards: DirectusDashboard[];
  directus_deployment_projects: DirectusDeploymentProject[];
  directus_deployment_runs: DirectusDeploymentRun[];
  directus_deployments: DirectusDeployment[];
  directus_extensions: DirectusExtension[];
  directus_fields: DirectusField[];
  directus_files: DirectusFile[];
  directus_flows: DirectusFlow[];
  directus_folders: DirectusFolder[];
  directus_migrations: DirectusMigration[];
  directus_notifications: DirectusNotification[];
  directus_operations: DirectusOperation[];
  directus_panels: DirectusPanel[];
  directus_permissions: DirectusPermission[];
  directus_policies: DirectusPolicy[];
  directus_presets: DirectusPreset[];
  directus_relations: DirectusRelation[];
  directus_revisions: DirectusRevision[];
  directus_roles: DirectusRole[];
  directus_sessions: DirectusSession[];
  directus_settings: DirectusSetting;
  directus_shares: DirectusShare[];
  directus_translations: DirectusTranslation[];
  directus_users: DirectusUser[];
  directus_versions: DirectusVersion[];
  events: Event[];
  events_files: EventsFile[];
  mastodon_followers: MastodonFollower[];
  mastodon_replies: MastodonReply[];
  pages: Page[];
  pages_sections: PagesSection[];
  products: Product[];
  sections: Section[];
  sections_blocks_content: SectionsBlocksContent[];
  sections_blocks_left_column: SectionsBlocksLeftColumn[];
  sections_blocks_right_column: SectionsBlocksRightColumn[];
  team_members: TeamMember[];
}


export type CollectionName = keyof Collections;

export type ItemIn<CollectionKey extends CollectionName> =
    Collections[CollectionKey] extends (infer Item extends Record<string, any>)[]
        ? Item
        : Collections[CollectionKey]

