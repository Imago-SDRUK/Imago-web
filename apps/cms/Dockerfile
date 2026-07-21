FROM directus/directus:11.17.4 AS cms

USER root
RUN corepack enable
USER node
COPY schema /directus/schema

RUN pnpm add @bicou/directus-extension-tiptap@1.18.6 @tiptap/core@2.26.2 @tiptap/extension-character-count@2.26.2 @tiptap/pm@2.26.2 @tiptap/starter-kit@2.26.1 @tiptap/extension-typography@2.26.2 @tiptap/extension-text-style@2.26.2 @tiptap/extension-font-family@2.26.2 


# FROM directus/directus:11.12.0 AS cms
#
# USER root
# RUN corepack enable
# USER node
#
# RUN ls -la
# COPY ./apps/cms/package.json /directus/
# RUN pnpm install --dangerously-allow-all-builds && pnpm rebuild
